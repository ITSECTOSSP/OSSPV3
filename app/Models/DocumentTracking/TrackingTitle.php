<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Events\DashboardUpdated;
use App\Notifications\OsspNotification;

use App\Models\User;
use App\Models\DocumentType;

class TrackingTitle extends Model
{
    protected $fillable = [
        'titles_dcn',
        'titles_title',
        'titles_from',
        'document_type_id',
        'classifications_id',
        'notify_depthead',
        'titles_subject',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    protected $attributes = [
        'notify_depthead' => false,
    ];

    protected $casts = [
        'notify_depthead' => 'boolean',
    ];

    /*
   |--------------------------------------------------------------------------
   | Auto Uppercase Mutators
   |--------------------------------------------------------------------------
   */

    public function setTitlesDcnAttribute($value)
    {
        $this->attributes['titles_dcn'] = strtoupper($value);
    }

    public function setTitlesTitleAttribute($value)
    {
        $this->attributes['titles_title'] = strtoupper($value);
    }

    public function setTitlesSubjectAttribute($value)
    {
        $this->attributes['titles_subject'] = strtoupper($value);
    }

    public function setTitlesFromAttribute($value)
    {
        $this->attributes['titles_from'] = strtoupper($value);
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships Indexing
    |--------------------------------------------------------------------------
    */
    public function documentType()
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }
    public function documentClassifications()
    {
        return $this->belongsTo(TrackingClassification::class, 'classifications_id');
    }
    public function files()
    {
        return $this->hasMany(TrackingFiles::class, 'tracking_titles_id');
    }
    public function assignments()
    {
        return $this->hasMany(TrackingAssigned::class, 'tracking_titles_id');
    }
    public function replies()
    {
        return $this->hasMany(TrackingReply::class, 'tracking_titles_id')
            ->orderBy('created_at', 'desc');
    }
    /*
    |--------------------------------------------------------------------------
    | Automatic User Tracking (Advanced Method)
    |--------------------------------------------------------------------------
    */
    private static function notifyDepartmentHeads($title)
    {
        $actor = Auth::user();

        if (!$actor || !$title || !$title->notify_depthead) return;

        // ✅ Get all department heads
        $deptHeads = User::where('role_id', 2)
            ->where('id', '!=', $actor->id) // optional: exclude actor
            ->get();

        foreach ($deptHeads as $user) {
            $user->notify(new OsspNotification(
                $title,
                'A Document has been marked for Department Head Notification.',
                'depthead_notification',
                $actor
            ));
        }
    }
    protected static function booted()
    {
        static::creating(function ($model) {

            if (Auth::check()) {
                $model->created_by = Auth::id();
                $model->updated_by = Auth::id();
            }

            // ===============================
            // AUTO MAP DOCUMENT TYPE RULE FOR CLASSIFICATION
            // ===============================
            if ($model->document_type_id) {

                $map = [
                    2 => ['classifications_id' => 5], //Memorandum
                    3 => ['classifications_id' => 5], //Office Order
                    4 => ['classifications_id' => 3], //Barangay Complaint  
                    5 => ['classifications_id' => 3], //Barangay Budget  
                    6 => ['classifications_id' => 3], //Barangay Resolution  
                    7 => ['classifications_id' => 3], //Barangay Ordinance        
                    8 => ['classifications_id' => 6], //Proposed Resolution
                    9 => ['classifications_id' => 6], //Proposed Ordinance
                ];

                if (isset($map[$model->document_type_id])) {
                    $model->classifications_id ??= $map[$model->document_type_id]['classifications_id'];
                }
            }
        });

        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::id();
            }
        });

        static::created(function ($model) {

            $title = $model->title;

            if ($title) {
                $title->updated_by = Auth::id(); // set current user
                $title->touch(); // updates updated_at
                $title->save(); // triggers updating event
            }

            broadcast(new DashboardUpdated('tracking_title_created', [
                'title_id' => $model->id,
            ]));
        });

        static::updated(function ($model) {


            broadcast(new DashboardUpdated('tracking_title_updated', [
                'title' => $model->load([
                    'assignments.section',
                    'documentType',
                    'documentClassifications',
                    'creator',
                    'editor',
                ]),
            ]));

            if ($model->wasChanged('notify_depthead') && $model->notify_depthead) {
                self::notifyDepartmentHeads($model);
            }
        });
    }
}
