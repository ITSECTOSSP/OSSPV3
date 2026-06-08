<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;


use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\LegislativeTracking\LegislativeCityCouncil;
use App\Models\LegislativeTracking\LegislativeCityCouncilor;
use App\Models\LegislativeTracking\LegislativeDistrict;

class LegislativeCityCouncilorController extends Controller
{
    /**
     * Display listing
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);

        $query = LegislativeCityCouncilor::with([
            'district:id,district_name',
            'cityCouncils:id,council_name',
        ]);

        /*
    |-----------------------------------------
    | Search
    |-----------------------------------------
    */
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('councilor_name', 'like', "%{$search}%")

                    ->orWhereHas('district', function ($district) use ($search) {
                        $district->where('district_name', 'like', "%{$search}%");
                    })

                    ->orWhereHas('cityCouncils', function ($cityCouncil) use ($search) {
                        $cityCouncil->where('council_name', 'like', "%{$search}%");
                    });
            });
        }

        /*
    |-----------------------------------------
    | Pagination
    |-----------------------------------------
    */
        $cityCouncilors = $query
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return inertia('admin/legislative-tracking/city-councilors/Index', [
            'cityCouncilors' => $cityCouncilors,
            'filters' => [
                'search' => $request->search,
            ],
            'perPage' => $perPage,
        ]);
    }

    /**
     * Create page
     */
    public function create()
    {
        return Inertia::render(
            'admin/legislative-tracking/city-councilors/Create',
            [
                'districts' => LegislativeDistrict::query()
                    ->orderBy('district_name')
                    ->get(),

                'cityCouncils' => LegislativeCityCouncil::query()
                    ->orderBy('id')
                    ->get(),
            ]
        );
    }

    /**
     * Store
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'district_id' => [
                'required',
                'exists:legislative_district,id',
            ],

            'councilor_name' => [
                'required',
                'string',
                'max:255',
            ],

            'details' => [
                'nullable',
                'string',
            ],

            'contact' => [
                'nullable',
                'string',
                'max:255',
            ],

            'city_councils' => [
                'nullable',
                'array',
            ],

            'city_councils.*' => [
                'exists:legislative_city_council,id',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create Councilor
        |--------------------------------------------------------------------------
        */

        $councilor = LegislativeCityCouncilor::create([

            'district_id' =>
            $validated['district_id'],

            'councilor_name' =>
            $validated['councilor_name'],

            'details' =>
            $validated['details'] ?? null,

            'contact' =>
            $validated['contact'] ?? null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Attach City Councils
        |--------------------------------------------------------------------------
        */

        $councilor->cityCouncils()->sync(
            $validated['city_councils'] ?? []
        );

        return redirect()
            ->route(
                'admin-panel.city-councilors.index'
            )
            ->with(
                'success',
                'City councilor created successfully.'
            );
    }

    /**
     * Edit page
     */
    public function edit(LegislativeCityCouncilor $cityCouncilor)
    {
        $cityCouncilor->load([
            'district:id,district_name',
            'cityCouncils:id,council_name',
        ]);

        return Inertia::render(
            'admin/legislative-tracking/city-councilors/Edit',
            [
                'cityCouncilor' => $cityCouncilor,

                'districts' => LegislativeDistrict::query()
                    ->orderBy('district_name')
                    ->get(['id', 'district_name']),

                'cityCouncils' => LegislativeCityCouncil::query()
                    ->orderBy('council_name')
                    ->get(['id', 'council_name']),
            ]
        );
    }

    /**
     * Update
     */
    public function update(Request $request, LegislativeCityCouncilor $cityCouncilor)
    {
        $validated = $request->validate([
            'district_id' => ['required', 'exists:legislative_district,id'],
            'councilor_name' => ['required', 'string', 'max:255'],
            'details' => ['nullable', 'string'],
            'contact' => ['nullable', 'string', 'max:255'],
            'city_councils' => ['nullable', 'array'],
            'city_councils.*' => ['exists:legislative_city_council,id'],
        ]);

        // -----------------------------------------
        // Update main record
        // -----------------------------------------
        $cityCouncilor->update([
            'district_id' => $validated['district_id'],
            'councilor_name' => $validated['councilor_name'],
            'details' => $validated['details'] ?? null,
            'contact' => $validated['contact'] ?? null,
        ]);

        // -----------------------------------------
        // Sync many-to-many relationship
        // -----------------------------------------
        $cityCouncilor->cityCouncils()->sync(
            $validated['city_councils'] ?? []
        );

        return redirect()
            ->route('admin-panel.city-councilors.index')
            ->with('success', 'City councilor updated successfully.');
    }

    /**
     * Delete
     */
    public function destroy(
        LegislativeCityCouncilor $cityCouncilor
    ) {

        $cityCouncilor->cityCouncils()->detach();

        $cityCouncilor->delete();

        return redirect()
            ->back()
            ->with(
                'success',
                'City councilor deleted successfully.'
            );
    }
}
