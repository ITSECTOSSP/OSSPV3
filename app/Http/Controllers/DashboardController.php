<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Events\DocumentStatusUpdated;

use App\Models\DocumentTracking\TrackingTitle;
use App\Models\DocumentTracking\TrackingAssignedStatus;
use App\Models\DocumentTracking\TrackingClassification;
use App\Models\DocumentType;
use App\Models\OsspSections;

class DashboardController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        // =========================
        // 1. Assignment-based titles (UNCHANGED)
        // =========================
        $trackingTitles = TrackingTitle::with([
            'assignments.section',
            'assignments.status',
            'documentType',
            'documentClassifications',
        ])
            ->whereHas('assignments', function ($query) use ($user) {
                $query->where('ossp_sections_id', $user->ossp_sections_id);
            })
            ->latest()
            ->get();

        // =========================
        // 2. Similarity/Docketing titles (GLOBAL FILTER)
        // =========================
        $similarityTitles = TrackingTitle::with([
            'assignments.section',
            'assignments.status',
            'documentType',
            'documentClassifications',
        ])
            ->whereIn('document_type_id', [8, 9])
            ->where('classifications_id', 6)
            ->latest()
            ->get();

        $docketingTitles = TrackingTitle::with([
            'assignments.section',
            'assignments.status',
            'documentType',
            'documentClassifications',
        ])
            ->whereIn('document_type_id', [8, 9])
            ->where('classifications_id', 5)
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'trackingTitles' => $trackingTitles,
            'similarityTitles' => $similarityTitles,
            'docketingTitles' => $docketingTitles,
            'currentUser' => $user,
            'userSectionName' => $user->section->sections_name,
            'userSectionId' => $user->ossp_sections_id,
        ]);
    }

    public function status(Request $request)
    {
        $statusId = $request->query('status');
        $user = Auth::user();

        $query = TrackingTitle::with([
            'assignments.section',
            'assignments.status',
            'documentType',
            'documentClassifications',
        ]);

        // SINGLE whereHas
        $query->whereHas('assignments', function ($q) use ($user, $statusId, $request) {

            $q->where('ossp_sections_id', $user->ossp_sections_id);

            if ($statusId) {
                $q->where('tracking_assigned_statuses_id', $statusId);
            }

            if ($request->filled('start_date') || $request->filled('end_date')) {

                $start = $request->start_date ?? '1970-01-01 00:00:00';
                $end = $request->end_date ?? now();

                $q->whereBetween('created_at', [$start, $end]);
            }
        });

        // SEARCH
        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('titles_title', 'like', "%{$search}%")
                    ->orWhere('titles_from', 'like', "%{$search}%")
                    ->orWhere('titles_subject', 'like', "%{$search}%");
            });
        }

        // FILTERS
        if ($request->filled('document_type_id')) {
            $query->where('document_type_id', $request->document_type_id);
        }

        if ($request->filled('classifications_id')) {
            $query->where('classifications_id', $request->classifications_id);
        }

        // IMPORTANT
        $trackingTitles = $query
            ->latest()
            ->get();

        $statusName = TrackingAssignedStatus::find($statusId)?->status_name ?? 'Unknown';

        return Inertia::render('document-tracking/tracking-assigned/Index', [
            'trackingTitles' => $trackingTitles,
            'userSectionId' => $user->ossp_sections_id,
            'statusId' => $statusId,
            'statusName' => $statusName,

            'filters' => [
                'search' => $request->search ?? '',
                'document_type_id' => $request->document_type_id ?? '',
                'classifications_id' => $request->classifications_id ?? '',
                'section_id' => $request->input('section_id', []),
                'start_date' => $request->start_date ?? '',
                'end_date' => $request->end_date ?? '',
                'per_page' => $request->integer('per_page', 10),
            ],

            'documentTypes' => DocumentType::all(),
            'trackingClassification' => TrackingClassification::all(),
            'osspSections' => OsspSections::all(),
        ]);
    }
}
