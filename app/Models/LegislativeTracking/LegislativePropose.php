<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Events\DashboardUpdated;

use App\Models\User;

class LegislativePropose extends Model
{
    protected $table = 'legislative_propose';

    // UUID settings
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'propose_no',
        'propose_title',
        'city_council_id',
        'measure_type_id',
        'created_by',
        'updated_by',
    ];

    protected static function booted()
    {
        // UUID + created_by + updated_by
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }

            if (Auth::check()) {
                $model->created_by = Auth::id();
                $model->updated_by = Auth::id();
            }
        });

        // Update editor
        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::id();
            }
        });

        // Broadcast create
        static::created(function ($model) {
            $fullModel = $model->load([
                'measureType',
                'approved',
                'creator',
                'editor',
            ]);

            broadcast(new DashboardUpdated(
                'legislative_propose_created',
                $fullModel
            ));
        });

        // Broadcast update
        static::updated(function ($model) {
            $fullModel = $model->load([
                'measureType',
                'approved',
                'creator',
                'editor',
            ]);

            broadcast(new DashboardUpdated(
                'legislative_propose_updated',
                $fullModel
            ));
        });
    }

    // Relationships
    public function measureType()
    {
        return $this->belongsTo(LegislativeMeasureType::class, 'measure_type_id');
    }

    public function citycouncil()
    {
        return $this->belongsTo(LegislativeCityCouncil::class, 'city_council_id');
    }
    public function approved()
    {
        return $this->hasMany(LegislativeApprove::class, 'propose_id');
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function proposeCouncilors()
    {
        return $this->hasMany(
            LegislativeProposeCouncilor::class,
            'legislative_propose_id'
        );
    }

    public function proponents()
    {
        return $this->belongsToMany(
            LegislativeCityCouncilor::class,
            'legislative_propose_councilor',
            'legislative_propose_id',
            'councilor_id'
        )->withTimestamps();
    }
}
