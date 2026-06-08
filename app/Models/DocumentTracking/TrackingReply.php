<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Events\DashboardUpdated;
use App\Notifications\OsspNotification;

use App\Models\User;
use App\Models\OsspSections;

class TrackingReply extends Model
{
    protected $fillable = [
        'tracking_titles_id',
        'ossp_sections_id',
        'reply_remarks',
        'created_by',
        'updated_by',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function title()
    {
        return $this->belongsTo(TrackingTitle::class, 'tracking_titles_id');
    }

    public function section()
    {
        return $this->belongsTo(OsspSections::class, 'ossp_sections_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function actionsTaken()
    {
        return $this->hasMany(TrackingActionTaken::class, 'tracking_reply_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Auto User Tracking
    |--------------------------------------------------------------------------
    */

    private static function notifyUsers($title, $message, $type)
    {
        $actor = Auth::user();

        if (!$actor || !$title) return;

        // ✅ Get assigned section IDs from the tracking
        $assignedSectionIds = $title->assignments()
            ->pluck('ossp_sections_id');

        // ✅ Get users in those sections (except sender)
        $users = User::whereIn('ossp_sections_id', $assignedSectionIds)
            ->where('id', '!=', $actor->id)
            ->get();

        foreach ($users as $user) {
            $user->notify(new OsspNotification(
                $title,
                $message,
                $type,
                $actor
            ));
        }
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                $user = Auth::user();

                if (!$user->ossp_sections_id) {
                    throw new \Exception('User must have a section before replying.');
                }

                $model->created_by = $user->id;
                $model->updated_by = $user->id;
                $model->ossp_sections_id = $user->ossp_sections_id;
            }
        });

        static::created(function ($model) {
            $user = Auth::user();
            $title = TrackingTitle::find($model->tracking_titles_id);

            if ($title) {
                $title->updated_by = $user->id;
                $title->touch();
                $title->save();
            }

            self::notifyUsers(
                $title,
                "{$user->first_name} {$user->middle_name} {$user->last_name} replied to a tracking",
                'reply_created'
            );

            $reply = $model->load([
                'creator:id,first_name,middle_name,last_name',
                'section:id,sections_name',
                'actionsTaken'
            ]);

            broadcast(new DashboardUpdated(
                'tracking_reply_created',
                [
                    'title_id' => $model->tracking_titles_id,
                    'reply' => $reply,
                ]
            ));
        });

        static::updated(function ($model) {
            $reply = $model->load([
                'creator:id,first_name,middle_name,last_name',
                'section:id,sections_name',
                'actionsTaken'
            ]);

            broadcast(new DashboardUpdated('tracking_reply_updated', [
                'title_id' => $model->tracking_titles_id,
                'reply' => $reply
            ]));
        });

        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::id();
            }
        });
    }
}
