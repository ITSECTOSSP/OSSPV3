<?php

namespace App\Models\LegislativeTracking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class LegislativeMeasureType extends Model
{
    use HasFactory;

    protected $table = 'legislative_measure_type';

    protected $fillable = [
        'measure_name',
    ];

    public function proposes()
    {
        return $this->hasMany(LegislativePropose::class, 'measure_type_id');
    }

    public function approves()
    {
        return $this->hasMany(LegislativeApprove::class, 'measure_type_id');
    }
}
