<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;
use App\Events\DashboardUpdated;

use App\Models\User;
use App\Models\DocumentTracking\TrackingTitle;
use App\Models\OsspSections;

class TrackingFiles extends Model
{
    protected $fillable = [
        'tfiles_file_path',
        'tfiles_original_name',
        'tfiles_mime_type',
        'tfiles_file_size',
        'upload_token',
        'tracking_titles_id',
        'uploaded_by',
        'ossp_sections_id',
        'tfiles_page_count',
    ];

    protected static function booted()
    {
        static::created(function ($model) {

            // Load relationships before broadcasting
            $model->load(['uploader', 'section']);

            broadcast(new DashboardUpdated(
                'tracking_files_uploaded',
                $model
            ));
        });
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function section()
    {
        return $this->belongsTo(OsspSections::class, 'ossp_sections_id');
    }
    public function title()
    {
        return $this->belongsTo(TrackingTitle::class, 'tracking_titles_id');
    }
}
