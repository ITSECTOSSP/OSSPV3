<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\DocumentTracking\TrackingClassification;

class DocumentClassificationsController extends Controller
{
    /**
     * Display listing
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);

        $trackingClassifications = TrackingClassification::query()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/document-tracking/document-classifications/Index', [
            'trackingClassifications' => $trackingClassifications,
            'perPage' => $perPage,
        ]);
    }


    /**
     * Show create form
     */
    public function create()
    {
        return Inertia::render('admin/document-tracking/document-classifications/Create');
    }

    /**
     * Store new document classification
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'classifications_name' => ['required', 'string', 'max:255'],
        ]);

        TrackingClassification::create($validated);

        return redirect()
            ->route('admin-panel.document-classifications.index')
            ->with('success', 'Document classification created successfully.');
    }

    /**
     * Show edit form
     */
    public function edit(TrackingClassification $trackingClassifications)
    {
        return Inertia::render('admin/document-tracking/document-classifications/Edit', [
            'trackingClassifications' => $trackingClassifications,
        ]);
    }

    /**
     * Update document classification
     */
    public function update(Request $request, TrackingClassification $trackingClassifications)
    {
        $validated = $request->validate([
            'classifications_name' => ['required', 'string', 'max:255'],
        ]);

        $trackingClassifications->update($validated);

        return redirect()
            ->route('admin-panel.document-classifications.index')
            ->with('success', 'Document classification updated successfully.');
    }

    /**
     * Delete document classification
     */
    public function destroy(TrackingClassification $trackingClassifications)
    {
        $trackingClassifications->delete();

        return redirect()
            ->route('admin-panel.document-classifications.index')
            ->with('success', 'Document classification deleted successfully.');
    }
}
