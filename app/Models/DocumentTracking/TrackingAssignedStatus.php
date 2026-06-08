<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;

class TrackingAssignedStatus extends Model
{
        protected $fillable = [
        'status_name',
    ];
        public function trackingAssignedStatus()
    {
        return $this->hasMany(TrackingAssigned::class, 'tracking_assigned_statuses_id');
    }
}
