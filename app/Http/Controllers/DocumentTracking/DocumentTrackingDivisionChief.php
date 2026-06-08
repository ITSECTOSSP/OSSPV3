<?php

namespace App\Http\Controllers\DocumentTracking;

use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Models\DocumentTracking\TrackingTitle;
use App\Models\DocumentTracking\TrackingClassification;
use App\Models\OsspSections;
use App\Models\DocumentType;

class DocumentTrackingDivisionChief extends Controller
{
    public function index(Request $request)
    {

        $user = $request->user(); // logged-in user
        $userSectionId = $user->ossp_sections_id;

         if (!$userSectionId) {
            abort(403, 'User does not have a section assigned.');
        }

        // Get the user's section and its division
        $userSection = OsspSections::with('division')->findOrFail($userSectionId);
        $divisionId = $userSection->ossp_division_id;

        $trackingTitles = TrackingTitle::with([
            'assignments.section.division', // eager load section + division
            'documentType',
            'documentClassifications',
        ])
            ->whereHas('assignments.section', function ($query) use ($divisionId) {
                $query->where('ossp_division_id', $divisionId);
            })
            ->latest()
            ->paginate(10); // or ->get() if not paginated

        // fetch all sections for dropdown (optional)
        $osspSections = OsspSections::where('ossp_division_id', $divisionId)->get();

        return Inertia::render('document-tracking/tracking-divchief/Index', [
            'titles' => $trackingTitles,
            'filters' => [
                'per_page' => 10,
            ],
            'documentTypes' => DocumentType::all(),
            'trackingClassification' => TrackingClassification::all(),
            'osspSections' => $osspSections,
            'divisionId' => $divisionId,
        ]);
    }
}
