<?php

namespace App\Http\Controllers\DocumentTracking;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\DocumentTracking\TrackingTitle;
use App\Models\DocumentTracking\TrackingAssigned;
use App\Models\DocumentTracking\TrackingClassification;
use App\Models\OsspSections;
use App\Models\DocumentType;


class DocumentTrackingAssignController extends Controller
{

    public function index(TrackingTitle $item)
    {
        $userSectionId = Auth::user()->ossp_sections_id;

        $item->load([
            'files',
            'files.uploader',
            'files.section',

            'assignments.section',
            'assignments.status',
            'assignments.creator',

            'replies.creator',
            'replies.section',
            'replies.actionsTaken',
        ]);

        $item->files->transform(function ($file) {
            $file->tfiles_file_path = Storage::url($file->tfiles_file_path);
            return $file;
        });

        // Check if this user's section has RECEIVED status
        $item->can_upload = $item->assignments
            ->where('ossp_sections_id', $userSectionId)
            ->where('tracking_assigned_statuses_id', 2)
            ->isNotEmpty();

        return Inertia::render('document-tracking/tracking-manage/Index', [
            'item' => $item,
            'documentTypes' => DocumentType::select('id', 'types_name')
                ->orderBy('types_name')
                ->get(),
            'trackingClassification' => TrackingClassification::select('id', 'classifications_name')
                ->orderBy('classifications_name')
                ->get(),
            'osspSections' => OsspSections::orderBy('sections_name')->get(),

            // ✅ Pass the authenticated user
            'currentUser' => Auth::user(),
        ]);
    }

    public function store(Request $request, TrackingTitle $item)
    {
        $validated = $request->validate([
            'assigned_remarks' => ['nullable', 'string'],
            'ossp_sections_ids' => ['required', 'array', 'min:1'],
            'ossp_sections_ids.*' => ['exists:ossp_sections,id']
        ]);

        $defaultStatusId = 1;

        foreach ($validated['ossp_sections_ids'] as $sectionId) {

            // Skip if already assigned
            $exists = TrackingAssigned::where('tracking_titles_id', $item->id)
                ->where('ossp_sections_id', $sectionId)
                ->exists();
            if ($exists) continue;

            // Create assignment
            TrackingAssigned::create([
                'tracking_titles_id' => $item->id,
                'ossp_sections_id' => $sectionId,
                'tracking_assigned_statuses_id' => $defaultStatusId,
                'assigned_remarks' => $validated['assigned_remarks'] ?? null,
                'created_by' => Auth::id(),
            ]);
        }

        return redirect()
            ->route('document-tracking.manage', $item)
            ->with('success', 'Document successfully assigned.');
    }

    public function update(Request $request, TrackingAssigned $assignment)
    {
        $validated = $request->validate([
            'assigned_remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        $item = $assignment->title->id;

        $assignment->update([
            'assigned_remarks' => $validated['assigned_remarks'],
        ]);
        return redirect()
            ->route('document-tracking.manage', $item)
            ->with('success', 'Assignment remarks updated successfully.');
    }

    public function destroy(TrackingAssigned $assignment)
    {
        $item = $assignment->title->id;

        $assignment->delete();

        return redirect()
            ->route('document-tracking.manage', $item)
            ->with('success', 'Assignment removed successfully.');
    }

    
}
