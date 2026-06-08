<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\LegislativeTracking\LegislativePropose;
use App\Models\LegislativeTracking\LegislativeCityCouncil;
use App\Models\LegislativeTracking\LegislativeMeasureType;
use App\Models\LegislativeTracking\LegislativeCityCouncilor;
use App\Models\User;


class LegislativeApprove extends Model
{
    use HasFactory;

    protected $table = 'legislative_approve';

    // UUID settings
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'approve_no',
        'approve_title',
        'city_council_id',
        'series_year',
        'enact_adopt_date',
        'propose_id',
        'measure_type_id',

        // ✅ audit fields
        'created_by',
        'updated_by',
    ];


    /*
    |--------------------------------------------------------------------------
    | Boot Model
    |--------------------------------------------------------------------------
    */
    protected static function booted()
    {
        // CREATE
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }

            if (Auth::check()) {
                $model->created_by = Auth::id();
                $model->updated_by = Auth::id();
            }
        });

        // UPDATE
        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::id();
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function propose()
    {
        return $this->belongsTo(LegislativePropose::class, 'propose_id');
    }

    public function citycouncil()
    {
        return $this->belongsTo(LegislativeCityCouncil::class, 'city_council_id');
    }

    public function measureType()
    {
        return $this->belongsTo(LegislativeMeasureType::class, 'measure_type_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function councilors()
    {
        return $this->belongsToMany(
            LegislativeCityCouncilor::class,
            'legislative_approve_councilor',
            'legislative_approve_id',
            'councilor_id'
        )->withPivot('role')->withTimestamps();
    }

    public function approveCouncilors()
    {
        return $this->hasMany(
            LegislativeApproveCouncilor::class,
            'legislative_approve_id'
        );
    }
    public function introducers()
    {
        return $this->belongsToMany(
            LegislativeCityCouncilor::class,
            'legislative_approve_councilor',
            'legislative_approve_id',
            'councilor_id'
        )
            ->withPivot('role')
            ->withTimestamps()
            ->wherePivot('role', 'introducer');
    }

    public function coIntroducers()
    {
        return $this->belongsToMany(
            LegislativeCityCouncilor::class,
            'legislative_approve_councilor',
            'legislative_approve_id',
            'councilor_id'
        )
            ->withPivot('role')
            ->withTimestamps()
            ->wherePivot('role', 'co_introducer');
    }
}
