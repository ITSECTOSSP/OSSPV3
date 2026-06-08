<?php

namespace App\Http\Controllers\DocumentTracking;

use App\Http\Controllers\Controller;
use Smalot\PdfParser\Parser;
use App\Events\DashboardUpdated;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\DocumentTracking\TrackingFiles;
use App\Models\DocumentTracking\TrackingTitle;
use App\Models\DocumentTracking\TrackingClassification;
use App\Models\OsspSections;
use App\Models\DocumentType;


class DocumentTrackingController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $perPage = $request->integer('per_page', 10);

        $query = TrackingTitle::with([
            'documentType',
            'documentClassifications',
            'creator',
            'editor',
            'assignments.section',
            'assignments.status',
            'assignments.creator',
            'replies.section',
            'replies.creator',
            'replies.actionsTaken',
        ])->orderBy('created_at', 'desc');

        // =========================
        // FILTERS
        // =========================

        if ($request->filled('document_type_id')) {
            $query->where('document_type_id', $request->document_type_id);
        }

        if ($request->filled('classifications_id')) {
            $query->where('classifications_id', $request->classifications_id);
        }

        if ($request->filled('section_id')) {
            $sectionIds = $request->input('section_id', []);

            if (!is_array($sectionIds)) {
                $sectionIds = [$sectionIds];
            }

            $query->whereHas('assignments', function ($q) use ($sectionIds) {
                $q->whereIn('ossp_sections_id', $sectionIds);
            });
        }

        // =========================
        // MULTI-SEARCH
        // =========================
        if ($request->filled('search')) {

            $search = $request->search;
            $searchArray = json_decode($search, true);

            if (is_array($searchArray)) {

                foreach ($searchArray as $term) {

                    $query->where(function ($q) use ($term) {

                        $q->where('titles_title', 'like', "%{$term}%")
                            ->orWhere('titles_from', 'like', "%{$term}%")
                            ->orWhere('titles_subject', 'like', "%{$term}%");
                    });
                }
            } else {

                $query->where(function ($q) use ($search) {

                    $q->where('titles_title', 'like', "%{$search}%")
                        ->orWhere('titles_from', 'like', "%{$search}%")
                        ->orWhere('titles_subject', 'like', "%{$search}%");
                });
            }
        }
        // =========================
        // DATE RANGE FILTER (CREATED_AT)
        // =========================
        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', Carbon::parse($request->start_date)->startOfDay());
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', Carbon::parse($request->end_date)->endOfDay());
        }

        // =========================
        // PAGINATION
        // =========================
        $titles = $query->paginate($perPage)->withQueryString();

        return Inertia::render('document-tracking/Index', [
            'currentUser' => $user,
            'titles' => $titles,
            'filters' => [
                'per_page' => $perPage,
                'document_type_id' => $request->document_type_id,
                'classifications_id' => $request->classifications_id,
                'section_id' => $request->input('section_id', []),

                // IMPORTANT: updated filters
                'search' => $request->search,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'documentTypes' => DocumentType::all(),
            'trackingClassification' => TrackingClassification::all(),
            'osspSections' => OsspSections::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render(
            'document-tracking/Create',
            [
                'documentTypes' => DocumentType::select('id', 'types_name')->orderBy('types_name')->get(),
                'trackingClassification' => TrackingClassification::select('id', 'classifications_name')->orderBy('classifications_name')->get(),
            ]
        );
    }
    public function store(Request $request)
    {
        $request->validate([
            'titles_title' => 'required|string|max:255',
            'titles_from' => 'nullable|string|max:50',
            'titles_subject' => 'nullable|string|max:100',
            'document_type_id' => 'required|exists:document_types,id',
            'upload_token' => 'required|uuid',
        ]);

        // 1. Create the tracking title
        $item = TrackingTitle::create([
            'titles_dcn' => $request->titles_dcn,
            'titles_title' => $request->titles_title,
            'titles_from' => $request->titles_from,
            'titles_subject' => $request->titles_subject,
            'document_type_id' => $request->document_type_id,
            'classifications_id' => $request->classifications_id,
        ]);

        // 2. Attach uploaded files
        TrackingFiles::whereNull('tracking_titles_id')
            ->where('upload_token', $request['upload_token'])
            ->update([
                'tracking_titles_id' => $item->id,
                'upload_token' => null, // cleanup
            ]);

        return redirect()
            ->route('document-tracking.index')
            ->with('success', 'Document tracking entry created successfully.');
    }
    public function destroy(TrackingTitle $item)
    {
        $item->delete();
        return redirect()->route('document-tracking.index')->with('success', 'Document tracking entry deleted successfully.');
    }
    public function edit(TrackingTitle $item)
    {
        // Load related files with uploader and section
        $item->load([
            'files.uploader',
            'files.section',
        ]);

        // Convert file paths to full URLs for frontend
        $files = $item->files->map(function ($file) {
            return [
                'id' => $file->id,
                'tfiles_original_name' => $file->tfiles_original_name,
                'tfiles_file_path' => Storage::url($file->tfiles_file_path), // full URL!
                'tfiles_mime_type' => $file->tfiles_mime_type,
                'tfiles_file_size' => $file->tfiles_file_size,
                'tracking_titles_id' => $file->tracking_titles_id,
                'created_at' => $file->created_at,
                'tfiles_page_count' => $file->tfiles_page_count,
                'uploader' => $file->uploader ? [
                    'id' => $file->uploader->id,
                    'full_name' => $file->uploader->full_name,
                ] : null,
                'section' => $file->section ? [
                    'id' => $file->section->id,
                    'sections_name' => $file->section->sections_name,
                ] : null,
            ];
        });

        // Convert IDs to strings for React <Select>
        $item->document_type_id = (string) $item->document_type_id;
        $item->classifications_id = (string) $item->classifications_id;

        return Inertia::render('document-tracking/Edit', [
            'item' => $item,
            'files' => $files, // full TrackingFile shape
            'documentTypes' => DocumentType::select('id', 'types_name')
                ->orderBy('types_name')
                ->get()
                ->map(fn($type) => ['id' => (string)$type->id, 'types_name' => $type->types_name]),
            'trackingClassification' => TrackingClassification::select('id', 'classifications_name')
                ->orderBy('classifications_name')
                ->get()
                ->map(fn($c) => ['id' => (string)$c->id, 'classifications_name' => $c->classifications_name]),
        ]);
    }

    public function update(Request $request, TrackingTitle $item)
    {
        $request->validate([
            'titles_dcn' => 'required|string|max:20',
            'titles_title' => 'required|string|max:255',
            'titles_from' => 'nullable|string|max:50',
            'titles_subject' => 'nullable|string|max:100',
            'document_type_id' => 'required|exists:document_types,id',
            'classifications_id' => 'required|exists:tracking_classifications,id',
        ]);
        $item->update([
            'titles_dcn' => $request->input('titles_dcn'),
            'titles_title' => $request->input('titles_title'),
            'titles_from' => $request->input('titles_from'),
            'titles_subject' => $request->input('titles_subject'),
            'document_type_id' => $request->input('document_type_id'),
            'classifications_id' => $request->input('classifications_id'),
        ]);

        return redirect()->route('document-tracking.index')->with('success', 'Document tracking entry updated successfully.');
    }

    public function tfilestoreCreate(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpeg,jpg', 'max:10240'],
        ]);

        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs(
            'uploads',
            $filename,
            'public'
        );

        $user = Auth::user();

        $pageCount = null;

        if ($file->getClientOriginalExtension() === 'pdf') {
            try {
                $parser = new Parser();
                $pdf = $parser->parseFile($file->getPathname());
                $pageCount = count($pdf->getPages());
            } catch (\Exception $e) {
                $pageCount = null; // fallback if parsing fails
            }
        }

        TrackingFiles::create([
            'tracking_titles_id' => $request->tracking_titles_id ?? null,
            'upload_token'      => $request->tracking_titles_id ? null : $request->upload_token,
            'tfiles_original_name' => $file->getClientOriginalName(),
            'tfiles_file_path'     => $path,
            'tfiles_mime_type'     => $file->getClientMimeType(),
            'tfiles_file_size'     => $file->getSize(),
            'tfiles_page_count'    => $pageCount,
            'uploaded_by'         => $user->id,
            'ossp_sections_id'    => $user->ossp_sections_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'pages' => $pageCount,
            'path' => $path
        ]);
    }

    public function destroyfileDestroy(TrackingFiles $trackingFile)
    {
        // Delete the physical file
        if (
            $trackingFile->tfiles_file_path &&
            Storage::disk('public')->exists($trackingFile->tfiles_file_path)
        ) {
            Storage::disk('public')->delete($trackingFile->tfiles_file_path);
        }

        // ❗ THIS LINE DELETES THE WHOLE ROW IN tracking_files
        $trackingFile->delete();

        return back()->with('success', 'File deleted.');
    }

    public function tfilestore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpeg,jpg', 'max:10240'],
            'tracking_titles_id' => ['nullable', 'exists:tracking_titles,id'],
            'upload_token' => ['nullable', 'string'],
        ]);

        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs('uploads', $filename, 'public');

        $user = Auth::user();

        $pageCount = null;

        // ✅ PDF page count
        if ($file->getClientOriginalExtension() === 'pdf') {
            try {
                $parser = new Parser();
                $pdf = $parser->parseFile($file->getPathname());
                $pageCount = count($pdf->getPages());
            } catch (\Exception $e) {
                $pageCount = null;
            }
        }

        // 🔥 SAVE TO DATABASE
        $trackingFile = TrackingFiles::create([
            'tracking_titles_id' => $request->tracking_titles_id,
            'upload_token' => $request->upload_token,
            'tfiles_original_name' => $file->getClientOriginalName(),
            'tfiles_file_path' => $path,
            'tfiles_file_size' => $file->getSize(),
            'tfiles_mime_type' => $file->getMimeType(),
            'tfiles_page_count' => $pageCount,
            'uploaded_by' => $user->id,
            'ossp_sections_id' => $user->section_id ?? null, // optional
        ]);

        // ✅ LOAD RELATIONSHIPS (CRITICAL FOR FRONTEND)
        $trackingFile->load([
            'uploader',
            'section',
        ]);

        // 🔥 BROADCAST FULL OBJECT
        broadcast(new DashboardUpdated(
            'tracking_files_uploaded',
            $trackingFile
        ))->toOthers();

        // ✅ RETURN FULL OBJECT TO UPLOADER
        return response()->json($trackingFile);
    }

    public function destroyfile(TrackingFiles $trackingFile)
    {
        $path = str_replace('storage/', '', $trackingFile->tfiles_file_path);

        // Delete the physical file
        if ($trackingFile->tfiles_file_path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        // Load relationships to match the structure your frontend expects
        $trackingFile->load(['uploader', 'section']);

        // Broadcast deletion with full object
        broadcast(new DashboardUpdated(
            'tracking_file_deleted',
            $trackingFile
        ))->toOthers();

        // Delete DB record
        $trackingFile->delete();

        return back()->with('success', 'File deleted.');
    }

    public function notifyDeptHead(TrackingTitle $item)
    {
        $item->update([
            'notify_depthead' => true
        ]);
        $item->save();

        return redirect()
            ->route('document-tracking.index')
            ->with('success', 'Department Head notified.');
    }

    public function show(TrackingTitle $item)
    {
        // load relationships you want to show
        $item->load([
            'documentType',
            'documentClassifications',
            'assignments.section',
            'assignments.status',
            'replies.creator',
        ]);

        return Inertia::render('document-tracking/Show', [
            'item' => $item,
        ]);
    }
}
