<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use App\Models\LegislativeTracking\LegislativeCityCouncil;

class LegislativeCityCouncilsController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);

        return Inertia::render(
            'admin/legislative-tracking/city-councils/Index',
            [
                'cityCouncils' => LegislativeCityCouncil::query()
                    ->latest()
                    ->paginate($perPage)
                    ->withQueryString(),

                'perPage' => $perPage,
            ]
        );
    }

    public function create()
    {
        return Inertia::render(
            'admin/legislative-tracking/city-councils/Create'
        );
    }

    public function edit(
        LegislativeCityCouncil $cityCouncil
    ) {
        return Inertia::render(
            'admin/legislative-tracking/city-councils/Edit',
            [
                'cityCouncil' => $cityCouncil,
            ]
        );
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'council_name' => [
                'required',
                'string',
                'max:255',
                'unique:legislative_city_council,council_name',
            ],
        ]);

        LegislativeCityCouncil::create($validated);

        return redirect()
            ->route('admin-panel.city-councils.index')
            ->with(
                'success',
                'City Council created successfully.'
            );
    }

    public function update(
        Request $request,
        LegislativeCityCouncil $cityCouncil
    ) {
        $validated = $request->validate([
            'council_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(
                    'legislative_city_council',
                    'council_name'
                )->ignore($cityCouncil->id),
            ],
        ]);

        $cityCouncil->update($validated);

        return redirect()
            ->route('admin-panel.city-councils.index')
            ->with(
                'success',
                'City Council updated successfully.'
            );
    }

    public function destroy(
        LegislativeCityCouncil $cityCouncil
    ) {
        if (
            $cityCouncil->approved()->exists() ||
            $cityCouncil->councilors()->exists()
        ) {
            return back()->with(
                'error',
                'Cannot delete. City Council is currently in use.'
            );
        }

        $cityCouncil->delete();

        return back()->with(
            'success',
            'City Council deleted successfully.'
        );
    }
}
