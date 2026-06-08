<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackingTitleBroadcastResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->titles_title ?? null,

            'document_type' => $this->whenLoaded('documentType', function () {
                return [
                    'id' => $this->documentType?->id,
                    'name' => $this->documentType?->name,
                ];
            }),

            'document_classification' => $this->whenLoaded('documentClassifications', function () {
                return [
                    'id' => $this->documentClassifications?->id,
                    'name' => $this->documentClassifications?->name,
                ];
            }),

            'assignments' => $this->assignments->map(function ($a) {
                return [
                    'id' => $a->id,
                    'remarks' => $a->assigned_remarks,

                    'section' => [
                        'id' => $a->section?->id,
                        'name' => $a->section?->sections_name,
                    ],

                    'status' => [
                        'id' => $a->status?->id,
                        'name' => $a->status?->status_name,
                    ],

                    'creator' => [
                        'id' => $a->creator?->id,
                        'name' => $a->creator?->full_name,
                    ],
                ];
            }),
        ];
    }
}