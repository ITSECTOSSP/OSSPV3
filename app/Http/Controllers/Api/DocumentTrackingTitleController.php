<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentTracking\TrackingTitle;
use App\Http\Resources\TrackingTitleBroadcastResource;

class DocumentTrackingTitleController extends Controller
{
     public function show($id)
    {
        $title = TrackingTitle::with([
            'documentType',
            'documentClassifications',
            'documentCategories',
            'assignments.section',
            'assignments.status',
            'assignments.creator',
            'files',
            'replies',
            'creator',
            'editor',
        ])->findOrFail($id);

        return new TrackingTitleBroadcastResource($title);
    }
}
