<?php

namespace App\Models\DocumentTracking;

use Illuminate\Database\Eloquent\Model;
use App\Events\DashboardUpdated;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\TrackingTitleDetailsResource;
use App\Notifications\OsspNotification;
use App\Http\Resources\TrackingAssignedBroadcastResource;

use App\Models\User;
use App\Models\OsspSections;

class TrackingAssigned extends Model
{
    protected $fillable = [
        'assigned_remarks',
        'tracking_titles_id',
        'ossp_sections_id',
        'tracking_assigned_statuses_id',
        'created_by',
        'status_2_date',
        'status_3_date',
        // new field for tracking who created the assignment
    ];

    /*
   |--------------------------------------------------------------------------
   | Auto Uppercase Mutators
   |--------------------------------------------------------------------------
   */

    public function title()
    {
        return $this->belongsTo(TrackingTitle::class, 'tracking_titles_id');
    }
    public function section()
    {
        return $this->belongsTo(OsspSections::class, 'ossp_sections_id')
            ->withDefault(function ($section) {
                $section->id = 99;
                $section->sections_name = 'Unknown Section';
            });
    }

    public function status()
    {
        return $this->belongsTo(TrackingAssignedStatus::class, 'tracking_assigned_statuses_id')
            ->withDefault(function ($status) {
                $status->id = 1;
                $status->status_name = 'Assigned';
            });
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')
            ->withDefault(function ($user) {
                $user->id = 0;
                $user->full_name = 'Unknown';
            });
    }

    private static function notifyUsers($title, $message, $type)
    {
        $actor = Auth::user();

        if (!$actor || !$title) return;

        // ✅ Get ONLY currently assigned section IDs
        $assignedSectionIds = $title->assignments()
            ->pluck('ossp_sections_id');

        // ✅ Get users ONLY from those sections
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
        // -----------------------------
        // Created Event
        // -----------------------------
        static::created(function ($model) {
            $title = $model->title;
            $actor = Auth::user();

            if ($title) {
                $title->updated_by = $actor->id ?? null;
                $title->touch();
                $title->save();
            }

            // Notify users in the newly assigned section(s)
            if ($actor && $title) {
                $sectionId = $model->ossp_sections_id;

                $users = User::where('ossp_sections_id', $sectionId)
                    ->where('id', '!=', $actor->id)
                    ->get();

                foreach ($users as $user) {
                    $user->notify(
                        new OsspNotification(
                            $title,
                            'New tracking assigned to your section',
                            'assigned',
                            $actor
                        )
                    );
                }
            }

            broadcast(new DashboardUpdated(
                'tracking_assigned_updated',
                [
                    'title_id' => $title->id,
                    'assignment' => new TrackingAssignedBroadcastResource(
                        $model->loadMissing([
                            'section',
                            'status',
                            'creator',
                        ])
                    ),
                ]
            ));
        });

        // -----------------------------
        // Updated Event
        // -----------------------------
        static::updated(function ($model) {
            $title = $model->title;
            $actor = Auth::user();

            if ($title) {
                $title->updated_by = $actor->id ?? null;
                $title->touch();
                $title->save();
            }
            broadcast(new DashboardUpdated(
                'tracking_assigned_updated',
                [
                    'title_id' => $title->id,
                    'assignment' => new TrackingAssignedBroadcastResource(
                        $model->loadMissing(['section', 'status', 'creator'])
                    ),
                ]
            ));
        });

        // -----------------------------
        // Deleted Event
        // -----------------------------
        static::deleted(function ($model) {
            $title = $model->title;
            $actor = Auth::user();

            if (!$title || !$actor) return;

            // Notify users in the removed section
            $removedSectionId = $model->ossp_sections_id;

            if ($removedSectionId) {
                $users = User::where('ossp_sections_id', $removedSectionId)
                    ->where('id', '!=', $actor->id)
                    ->get();

                foreach ($users as $user) {
                    $user->notify(new OsspNotification(
                        $title,
                        'Your section was removed from this tracking',
                        'assignment_removed',
                        $actor
                    ));
                }
            }

            // Reload full updated title after deletion
            broadcast(new DashboardUpdated(
                'tracking_assigned_updated',
                [
                    'type' => 'tracking_assigned_deleted',
                    'title' => new TrackingTitleDetailsResource(
                        $title->load([
                            'documentType',
                            'documentClassifications',
                        ])
                    ),
                    'deleted_assignment_id' => $model->id,
                ]
            ));
        });

        // -----------------------------
        // Updating Event (status dates)
        // -----------------------------
        static::updating(function ($trackingAssigned) {
            if ($trackingAssigned->tracking_assigned_statuses_id == 2 && !$trackingAssigned->status_2_date) {
                $trackingAssigned->status_2_date = now();
            }

            if ($trackingAssigned->tracking_assigned_statuses_id == 3 && !$trackingAssigned->status_3_date) {
                $trackingAssigned->status_3_date = now();
            }
        });
    }
}
