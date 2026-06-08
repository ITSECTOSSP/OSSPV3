<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OsspDivisions;

class OsspSections extends Model
{
    protected $fillable = [
        'sections_name',
        'ossp_division_id',
    ];
    public function trackingAssigned()
    {
        return $this->hasMany(TrackingAssigned::class, 'ossp_sections_id');
    }
    public function users()
    {
        return $this->hasMany(User::class, 'ossp_sections_id');
    }
    public function division()
    {
        return $this->belongsTo(OsspDivisions::class, 'ossp_division_id');
    }
}
