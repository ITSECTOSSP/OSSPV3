<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;

class TrackingClassification extends Model
{
        protected $fillable = [
        'classifications_name',
    ];
        public function trackingTitles()
    {
        return $this->hasMany(TrackingTitle::class, 'classifications_id');
    }
}
