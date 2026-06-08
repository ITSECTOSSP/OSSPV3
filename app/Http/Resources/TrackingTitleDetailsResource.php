<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackingTitleDetailsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // Core identity
            'titles_dcn' => $this->titles_dcn,
            'title' => $this->titles_title,

            // Optional lightweight metadata
            'titles_from' => $this->titles_from ?? null,

            // Document info (safe small payload)
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

            // 🔥 IMPORTANT: SAFE METRIC ONLY
            'assignments_count' => $this->relationLoaded('assignments')
                ? $this->assignments->count()
                : null,

            'updated_at' => $this->updated_at,
        ];
    }
}