<?php

namespace App\Http\Controllers\DocumentTracking;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\DocumentTracking\TrackingTitle;


class DocumentTrackingFilterbySection extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $trackingTitles = TrackingTitle::with(['assignments.section'])
            ->whereHas('assignments', function ($query) use ($user) {
                $query->where('ossp_sections_id', $user->ossp_sections_id);
            })
            ->latest()
            ->get();

        return Inertia::render('Tracking/Index', [
            'trackingTitles' => $trackingTitles
        ]);
    }
}
