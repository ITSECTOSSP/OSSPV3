<?php


namespace App\Http\Controllers\LegislativeTracking;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use App\Models\LegislativeTracking\LegislativeCityCouncil;
use App\Models\LegislativeTracking\LegislativeMeasureType;
use App\Models\LegislativeTracking\LegislativePropose;


class LegislativeProposeController extends Controller
{
    //Foward route to index page
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);

        $query = LegislativePropose::with([
            'measureType',
            'citycouncil',
            'creator',
            'editor',
            'proponents',
        ])->orderBy('created_at', 'desc');

        // Filters
        if ($request->filled('measure_type_id')) {
            $query->where('measure_type_id', $request->measure_type_id);
        }

        if ($request->filled('city_council_id')) {
            $query->where('city_council_id', $request->city_council_id);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $keywords = json_decode($search, true);

            $query->where(function ($q) use ($keywords, $search) {

                // CASE 1: empty array → ignore filter completely
                if (is_array($keywords) && count($keywords) === 0) {
                    return;
                }

                // CASE 2: array search
                if (is_array($keywords) && count($keywords) > 0) {
                    foreach ($keywords as $word) {
                        $q->where(function ($sub) use ($word) {
                            $sub->where('propose_no', 'like', "%{$word}%")
                                ->orWhere('propose_title', 'like', "%{$word}%");
                        });
                    }
                    return;
                }

                // CASE 3: fallback string search
                $q->where('propose_no', 'like', "%{$search}%")
                    ->orWhere('propose_title', 'like', "%{$search}%");
            });
        }


        $proposes = $query->paginate($perPage)->withQueryString();

        $proposes->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'propose_no' => $item->propose_no,
                'propose_title' => $item->propose_title,

                'citycouncil' => $item->citycouncil ? [
                    'id' => $item->citycouncil->id,
                    'council_name' => $item->citycouncil->council_name,
                ] : null,

                'measureType' => $item->measureType ? [
                    'id' => $item->measureType->id,
                    'measure_name' => $item->measureType->measure_name,
                ] : null,

                'proponents' => $item->proponents
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'councilor_name' => $c->councilor_name,
                    ])
                    ->values(),

                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return Inertia::render('legislative-tracking/propose/Index', [
            'proposes' => $proposes,
            'filters' => [
                'per_page' => $perPage,
                'measure_type_id' => $request->measure_type_id,
                'city_council_id' => $request->city_council_id,
                'search' => $request->search,
            ],
            'measureType' => LegislativeMeasureType::all(),
            'cityCouncil' => LegislativeCityCouncil::orderByDesc('id')->get(),
            'total_count' => $proposes->total(),
        ]);
    }

    // Forward route to create form
    public function create()
    {
        $citycouncils = LegislativeCityCouncil::select(
            'id',
            'council_name'
        )
            ->orderByDesc('id')
            ->get();

        return Inertia::render('legislative-tracking/propose/Create', [

            'measureTypes' => LegislativeMeasureType::select(
                'id',
                'measure_name'
            )->get(),

            'citycouncils' => $citycouncils,

            // default selected value
            'defaultCityCouncilId' => optional(
                $citycouncils->first()
            )->id,

        ]);
    }
    //Edit form
    public function edit(LegislativePropose $item)
    {
        $item->load([
            'measureType',
            'citycouncil',
            'proponents',
        ]);

        $citycouncils = LegislativeCityCouncil::select(
            'id',
            'council_name'
        )
            ->orderByDesc('id')
            ->get();

        return Inertia::render(
            'legislative-tracking/propose/Edit',
            [
                'item' => $item,

                'proponent_ids' => $item->proponents
                    ->pluck('id')
                    ->map(fn($id) => (string) $id)
                    ->values(),

                'measureTypes' =>
                LegislativeMeasureType::select(
                    'id',
                    'measure_name'
                )->get(),

                'citycouncils' => $citycouncils,
            ]
        );
    }
    //Store to database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'propose_no' => ['required', 'string', 'max:255'],
            'propose_title' => ['required', 'string'],
            'measure_type_id' => [
                'required',
                'exists:legislative_measure_type,id'
            ],

            'city_council_id' => [
                'nullable',
                'exists:legislative_city_council,id'
            ],

            'proponent_ids' => ['array'],
            'proponent_ids.*' => [
                'exists:legislative_city_councilor,id'
            ],
        ]);

        DB::transaction(function () use ($validated) {

            $propose = LegislativePropose::create([
                'propose_no' => strtoupper($validated['propose_no']),
                'propose_title' => strtoupper($validated['propose_title']),
                'measure_type_id' => $validated['measure_type_id'],
                'city_council_id' => $validated['city_council_id'] ?? null,
            ]);

            $propose->proponents()->sync(
                $validated['proponent_ids'] ?? []
            );
        });

        return redirect()
            ->route('legislative-tracking.propose.index')
            ->with(
                'success',
                'Proposed measure created successfully.'
            );
    }
    //Update to database
    public function update(Request $request, LegislativePropose $item)
    {
        $validated = $request->validate([
            'propose_no' => ['required', 'string', 'max:255'],
            'propose_title' => ['required', 'string'],
            'measure_type_id' => [
                'required',
                'exists:legislative_measure_type,id'
            ],
            'city_council_id' => [
                'nullable',
                'exists:legislative_city_council,id'
            ],

            'proponent_ids' => ['array'],
            'proponent_ids.*' => [
                'integer',
                'exists:legislative_city_councilor,id'
            ],
        ]);

        DB::transaction(function () use ($item, $validated) {

            // Update main record
            $item->update([
                'propose_no' => strtoupper($validated['propose_no']),
                'propose_title' => strtoupper($validated['propose_title']),
                'measure_type_id' => $validated['measure_type_id'],
                'city_council_id' => $validated['city_council_id'] ?? null,
            ]);

            // Update proponents
            $item->proponents()->sync(
                $validated['proponent_ids'] ?? []
            );
        });

        return redirect()
            ->route('legislative-tracking.propose.index')
            ->with(
                'success',
                'Proposed measure updated successfully.'
            );
    }
    //Delete from database
    public function destroy(LegislativePropose $item)
    {
        $item->delete();

        return redirect()
            ->back()
            ->with('success', 'Proposed measure deleted successfully.');
    }
}
