<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackingAssignedBroadcastResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'tracking_titles_id' => $this->tracking_titles_id,
            'ossp_sections_id' => $this->ossp_sections_id,
            'tracking_assigned_statuses_id' => $this->tracking_assigned_statuses_id,
            'assigned_remarks' => $this->assigned_remarks,

            'status_2_date' => $this->status_2_date,
            'status_3_date' => $this->status_3_date,

            'section' => $this->whenLoaded('section', function () {
                return [
                    'id' => $this->section?->id,
                    'name' => $this->section?->sections_name,
                ];
            }),

            'status' => $this->whenLoaded('status', function () {
                return [
                    'id' => $this->status?->id,
                    'name' => $this->status?->status_name,
                ];
            }),

            'creator' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator?->id,
                    'name' => $this->creator?->full_name,
                ];
            }),
        ];
    }
}