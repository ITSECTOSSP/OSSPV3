<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\LegislativeTracking\LegislativeCityCouncilor;

class LegislativeCityCouncil extends Model
{
    use HasFactory;

    protected $table = 'legislative_city_council';

    // Mass assignable attributes
    protected $fillable = [
        'council_name',
    ];

        public function proposed()
    {
        return $this->hasMany(LegislativePropose::class, 'city_council_id');
    }

    public function approved()
    {
        return $this->hasMany(LegislativeApprove::class, 'city_council_id');
    }

    public function councilors()
    {
        return $this->belongsToMany(
            LegislativeCityCouncilor::class,
            'legislative_city_council_councilor',
            'city_council_id',
            'councilor_id'
        );
    }
}
