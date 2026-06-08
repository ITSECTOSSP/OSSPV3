<?php
namespace App\Http\Controllers\DocumentTracking;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\DocumentTracking\TrackingTitle;

class DocumentTrackingDepartmentHead extends Controller
{
    /**
     * Display the pending tracking titles for the Dept. Head
     */
    public function index(Request $request)
    {
        // Fetch tracking titles with notify_depthead = true and zero assignments
        $trackingTitles = TrackingTitle::with([
            'documentType',
            'documentClassifications',
            'assignments.section', // eager load assignments (should be empty)
            'assignments.status',
        ])
        ->where('notify_depthead', true)
        ->whereDoesntHave('assignments') // only zero assignments
        ->latest()
        ->get();

        return Inertia::render('document-tracking/tracking-depthead/Index', [
            'trackingTitles' => $trackingTitles,
        ]);
    }
}