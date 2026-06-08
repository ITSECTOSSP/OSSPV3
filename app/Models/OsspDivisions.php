<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OsspSections;

class OsspDivisions extends Model
{
    use HasFactory;

    // Table name (optional if it follows Laravel naming convention)
    protected $table = 'ossp_divisions';

    // Mass assignable fields
    protected $fillable = [
        'divisions_name',
    ];

    /**
     * Get all sections under this division
     */
    public function sections()
    {
        return $this->hasMany(OSSPSections::class, 'ossp_division_id');
    }
}