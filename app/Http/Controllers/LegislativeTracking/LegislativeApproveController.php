<?php


namespace App\Http\Controllers\LegislativeTracking;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use App\Models\LegislativeTracking\LegislativeCityCouncil;
use App\Models\LegislativeTracking\LegislativeMeasureType;
use App\Models\LegislativeTracking\LegislativeApprove;


class LegislativeApproveController extends Controller
{
    //Foward route to index page
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);

        $query = LegislativeApprove::with([
            'measureType',
            'citycouncil',
            'creator',
            'editor',
        ])->orderBy('created_at', 'desc');

        // Filters
        if ($request->filled('measure_type_id')) {
            $query->where('measure_type_id', $request->measure_type_id);
        }

        if ($request->filled('city_council_id')) {
            $query->where('city_council_id', $request->city_council_id);
        }

        if ($request->filled('series_year')) {
            $query->where('series_year', (int) $request->series_year);
        }

        if ($request->filled('enact_start_date')) {
            $start = Carbon::parse($request->enact_start_date)->startOfDay();
            $query->where('enact_adopt_date', '>=', $start);
        }

        if ($request->filled('enact_end_date')) {
            $end = Carbon::parse($request->enact_end_date)->endOfDay();
            $query->where('enact_adopt_date', '<=', $end);
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
                            $sub->where('approve_no', 'like', "%{$word}%")
                                ->orWhere('approve_title', 'like', "%{$word}%");
                        });
                    }
                    return;
                }

                // CASE 3: fallback string search
                $q->where('approve_no', 'like', "%{$search}%")
                    ->orWhere('approve_title', 'like', "%{$search}%");
            });
        }

        $years = LegislativeApprove::select('series_year')
            ->whereNotNull('series_year')
            ->distinct()
            ->orderBy('series_year', 'desc')
            ->pluck('series_year');

        $approves = $query->paginate($perPage)->withQueryString();

        $approves->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'approve_no' => $item->approve_no,
                'approve_title' => $item->approve_title,
                'series_year' => $item->series_year,
                'enact_adopt_date' => $item->enact_adopt_date,

                'citycouncil' => $item->citycouncil ? [
                    'id' => $item->citycouncil->id,
                    'council_name' => $item->citycouncil->council_name,
                ] : null,

                'measureType' => $item->measureType ? [
                    'id' => $item->measureType->id,
                    'measure_name' => $item->measureType->measure_name,
                ] : null,

                'introducers' => $item->introducers->map(fn($c) => [
                    'id' => $c->id,
                    'councilor_name' => $c->councilor_name,
                ])->values(),

                'coIntroducers' => $item->coIntroducers->map(fn($c) => [
                    'id' => $c->id,
                    'councilor_name' => $c->councilor_name,
                ])->values(),

                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return Inertia::render('legislative-tracking/approve/Index', [
            'approves' => $approves,
            'filters' => [
                'per_page' => $perPage,
                'measure_type_id' => $request->measure_type_id,
                'city_council_id' => $request->city_council_id,
                'series_year' => $request->series_year,
                'search' => $request->search,
            ],
            'measureType' => LegislativeMeasureType::all(),
            'cityCouncil' => LegislativeCityCouncil::orderByDesc('id')->get(),
            'years' => $years,
            'total_count' => $approves->total(),
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

        return Inertia::render('legislative-tracking/approve/Create', [

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
    public function edit(LegislativeApprove $item)
    {
        $item->load([
            'measureType',
            'citycouncil',
            'introducers',
            'coIntroducers',
        ]);

        $citycouncils = LegislativeCityCouncil::select('id', 'council_name')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('legislative-tracking/approve/Edit', [
            'item' => $item,

            // ✅ clean IDs from relationship
            'introducer_ids' => $item->introducers
                ->pluck('id')
                ->map(fn($id) => (string) $id)
                ->values(),

            'co_introducer_ids' => $item->coIntroducers
                ->pluck('id')
                ->map(fn($id) => (string) $id)
                ->values(),

            'measureTypes' => LegislativeMeasureType::select('id', 'measure_name')->get(),
            'citycouncils' => $citycouncils,
        ]);
    }
    //Store to database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'approve_no' => ['required', 'string', 'max:255'],
            'approve_title' => ['required', 'string'],
            'measure_type_id' => ['required', 'exists:legislative_measure_type,id'],

            'enact_adopt_date' => ['required', 'date'],
            'series_year' => ['required', 'digits:4'],

            'city_council_id' => ['nullable', 'exists:legislative_city_council,id'],

            // ✅ NEW
            'introducer_ids' => ['array'],
            'introducer_ids.*' => ['exists:legislative_city_councilor,id'],

            'co_introducer_ids' => ['array'],
            'co_introducer_ids.*' => ['exists:legislative_city_councilor,id'],
        ]);

        DB::transaction(function () use ($validated) {

            $approve = LegislativeApprove::create([
                'approve_no' => strtoupper($validated['approve_no']),
                'approve_title' => strtoupper($validated['approve_title']),
                'measure_type_id' => $validated['measure_type_id'],
                'enact_adopt_date' => $validated['enact_adopt_date'],
                'series_year' => $validated['series_year'],
                'city_council_id' => $validated['city_council_id'] ?? null,
            ]);

            $syncData = [];

            foreach ($validated['introducer_ids'] ?? [] as $id) {
                $syncData[$id] = ['role' => 'introducer'];
            }

            foreach ($validated['co_introducer_ids'] ?? [] as $id) {
                $syncData[$id] = ['role' => 'co_introducer'];
            }

            $approve->councilors()->sync($syncData);
        });

        return redirect()
            ->route('legislative-tracking.approve.index')
            ->with('success', 'Approved measure created successfully.');
    }
    //Update to database
    public function update(Request $request, LegislativeApprove $item)
    {
        $validated = $request->validate([
            'approve_no' => ['required', 'string', 'max:255'],
            'approve_title' => ['required', 'string'],
            'measure_type_id' => ['required', 'exists:legislative_measure_type,id'],
            'enact_adopt_date' => ['required', 'date'],
            'series_year' => ['required', 'digits:4'],
            'city_council_id' => ['nullable', 'exists:legislative_city_council,id'],

            'introducer_ids' => ['array'],
            'introducer_ids.*' => ['integer', 'exists:legislative_city_councilor,id'],

            'co_introducer_ids' => ['array'],
            'co_introducer_ids.*' => ['integer', 'exists:legislative_city_councilor,id'],
        ]);

        DB::transaction(function () use ($item, $validated) {

            // 1. Update main table
            $item->update([
                'approve_no' => strtoupper($validated['approve_no']),
                'approve_title' => strtoupper($validated['approve_title']),
                'measure_type_id' => $validated['measure_type_id'],
                'enact_adopt_date' => $validated['enact_adopt_date'],
                'series_year' => $validated['series_year'],
                'city_council_id' => $validated['city_council_id'] ?? null,
            ]);

            // 2. Remove old relations
            $item->approveCouncilors()->delete();

            // 3. Insert introducers
            foreach ($validated['introducer_ids'] ?? [] as $id) {
                $item->approveCouncilors()->create([
                    'councilor_id' => $id,
                    'role' => 'introducer',
                ]);
            }

            // 4. Insert co-introducers
            foreach ($validated['co_introducer_ids'] ?? [] as $id) {
                $item->approveCouncilors()->create([
                    'councilor_id' => $id,
                    'role' => 'co_introducer',
                ]);
            }
        });

        return redirect()
            ->route('legislative-tracking.approve.index')
            ->with('success', 'Approved measure updated successfully.');
    }
    //Delete from database
    public function destroy(LegislativeApprove $item)
    {
        $item->delete();

        return redirect()
            ->back()
            ->with('success', 'Approved measure deleted successfully.');
    }
}
