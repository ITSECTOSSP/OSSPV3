<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\DocumentTracking\TrackingTitle;

class DocumentType extends Model
{
    protected $fillable = [
        'types_name',

    ];
    public function trackingTitles()
    {
        return $this->hasMany(TrackingTitle::class, 'document_type_id');
    }
    
}
