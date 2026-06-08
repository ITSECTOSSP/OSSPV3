<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegislativeDistrict extends Model
{
    use HasFactory;

    protected $table = 'legislative_district';

    protected $fillable = [
        'district_name',
    ];

    /**
     * District has many councilors
     */
    public function councilors()
    {
        return $this->hasMany(
            LegislativeCityCouncilor::class,
            'district_id'
        );
    }
}