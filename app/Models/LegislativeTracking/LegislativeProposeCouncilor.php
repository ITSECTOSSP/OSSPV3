<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Model;

use App\Models\LegislativeTracking\LegislativePropose;
use App\Models\LegislativeTracking\LegislativeCityCouncilor;

class LegislativeProposeCouncilor extends Model
{
    protected $table = 'legislative_propose_councilor';

    protected $fillable = [
        'legislative_propose_id',
        'councilor_id',
    ];

    public function propose()
    {
        return $this->belongsTo(
            LegislativePropose::class,
            'legislative_propose_id'
        );
    }

    public function councilor()
    {
        return $this->belongsTo(
            LegislativeCityCouncilor::class,
            'councilor_id'
        );
    }
}
