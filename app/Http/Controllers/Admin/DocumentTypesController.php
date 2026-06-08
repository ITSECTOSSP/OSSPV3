<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\DocumentType;

class DocumentTypesController extends Controller
{
    /**
     * Display listing
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);

        $documentTypes = DocumentType::query()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/document-tracking/document-types/Index', [
            'documentTypes' => $documentTypes,
            'perPage' => $perPage,
        ]);
    }


    /**
     * Show create form
     */
    public function create()
    {
        return Inertia::render('admin/document-tracking/document-types/Create');
    }

    /**
     * Store new document type
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'types_name' => ['required', 'string', 'max:255'],
        ]);

        DocumentType::create($validated);

        return redirect()
            ->route('admin-panel.document-types.index')
            ->with('success', 'Document type created successfully.');
    }

    /**
     * Show edit form
     */
    public function edit(DocumentType $documentTypes)
    {
        return Inertia::render('admin/document-tracking/document-types/Edit', [
            'documentTypes' => $documentTypes,
        ]);
    }

    /**
     * Update document type
     */
    public function update(Request $request, DocumentType $documentTypes)
    {
        $validated = $request->validate([
            'types_name' => ['required', 'string', 'max:255'],
        ]);

        $documentTypes->update($validated);

        return redirect()
            ->route('admin-panel.document-types.index')
            ->with('success', 'Document type updated successfully.');
    }

    /**
     * Delete document type
     */
    public function destroy(DocumentType $documentTypes)
    {
        $documentTypes->delete();

        return redirect()
            ->route('admin-panel.document-types.index')
            ->with('success', 'Document type deleted successfully.');
    }
}
