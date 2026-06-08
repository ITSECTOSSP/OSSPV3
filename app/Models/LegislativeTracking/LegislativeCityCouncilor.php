<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\LegislativeTracking\LegislativeDistrict;

class LegislativeCityCouncilor extends Model
{
    use HasFactory;

    protected $table = 'legislative_city_councilor';

    protected $fillable = [
        'district_id',
        'councilor_name',
        'details',
        'contact',
    ];

    /**
     * City Council relationship
     */
    public function cityCouncils()
    {
        return $this->belongsToMany(
            LegislativeCityCouncil::class,
            'legislative_city_council_councilor',
            'councilor_id',
            'city_council_id'
        );
    }

    /**
     * District relationship
     */
    public function district()
    {
        return $this->belongsTo(LegislativeDistrict::class, 'district_id');
    }

    /**
     * Measures where councilor is an introducer
     */
    public function introducedMeasures()
    {
        return $this->belongsToMany(
            LegislativeApprove::class,
            'legislative_approve_introducer',
            'councilor_id',
            'approve_id'
        );
    }

    /**
     * Measures where councilor is a co-introducer
     */
    public function coIntroducedMeasures()
    {
        return $this->belongsToMany(
            LegislativeApprove::class,
            'legislative_approve_co_introducer',
            'councilor_id',
            'approve_id'
        );
    }

    /**
     * Measures as introducer/co-introducer
     */
    public function legislativeApproves()
    {
        return $this->belongsToMany(
            LegislativeApprove::class,
            'legislative_approve_councilor',
            'councilor_id',
            'legislative_approve_id'
        )->withPivot('role')->withTimestamps();
    }
        public function legislativeProposes()
    {
        return $this->belongsToMany(
            LegislativePropose::class,
            'legislative_propose_councilor',
            'councilor_id',
            'legislative_propose_id'
        )->withPivot('role')->withTimestamps();
    }
}
