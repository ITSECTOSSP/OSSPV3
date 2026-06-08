<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Notifications\OsspNotification;
use App\Events\DashboardUpdated;
use App\Http\Resources\TrackingTitleBroadcastResource;

use App\Models\User;
use App\Models\DocumentTracking\TrackingAssigned;
use App\Models\DocumentTracking\TrackingReply;





class TrackingActionTaken extends Model
{
    protected $fillable = [
        'tracking_reply_id',
        'action_taken_text',
        'created_by',
    ];

    /**
     * The reply this action belongs to
     */
    public function reply()
    {
        return $this->belongsTo(TrackingReply::class, 'tracking_reply_id');
    }

    /**
     * The user who created this action
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    private static function notifyUsers($title, $actor, string $message, string $type)
    {
        if (!$actor || !$title) return;

        // ✅ Get all currently assigned sections for this tracking
        $assignedSectionIds = $title->assignments()
            ->pluck('ossp_sections_id')
            ->unique();

        if ($assignedSectionIds->isEmpty()) return;

        // ✅ Get all users in those sections except the actor
        $users = User::whereIn('ossp_sections_id', $assignedSectionIds)
            ->where('id', '!=', $actor->id)
            ->get();

        if ($users->isEmpty()) return;

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
        static::created(function ($model) {
            $user = Auth::user();
            if (!$user) return;

            // ✅ Get the tracking title via reply
            $reply = $model->reply()->with('title')->first();
            $title = $reply?->title;
            if (!$title) return;

            // ✅ Update assigned status to "Accomplished" only if currently Received (2)
            $assigned = TrackingAssigned::where('tracking_titles_id', $title->id)
                ->where('ossp_sections_id', $user->ossp_sections_id)
                ->where('tracking_assigned_statuses_id', 2)
                ->first();

            if ($assigned) {
                $assigned->tracking_assigned_statuses_id = 3;
                $assigned->status_3_date = now();
                $assigned->save(); // 🔥 triggers events if you have model events
            }

            // ✅ Notify other users in the tracking
            self::notifyUsers(
                $title,
                $user,
                "{$user->full_name} marked this tracking as accomplished",
                'accomplished'
            );

            // ✅ Broadcast update for live cards
            $title = $title->loadMissing([
                'documentType',
                'documentClassifications',
                'assignments.section',
                'assignments.status',
            ]);

            broadcast(new DashboardUpdated(
                'tracking_assigned_updated',
                [
                    'title_id' => $title->id,
                    'full_title' => new TrackingTitleBroadcastResource($title),
                ]
            ));
        });
    }
}
