<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Model;

use App\Models\LegislativeTracking\LegislativeApprove;
use App\Models\LegislativeTracking\LegislativeCityCouncilor;

class LegislativeApproveCouncilor extends Model
{
    protected $table = 'legislative_approve_councilor';

    protected $fillable = [
        'approve_id',
        'councilor_id',
        'role',
    ];

    public function approve()
    {
        return $this->belongsTo(
            LegislativeApprove::class,
            'approve_id'
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