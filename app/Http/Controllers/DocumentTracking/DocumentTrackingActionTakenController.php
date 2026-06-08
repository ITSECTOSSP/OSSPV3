<?php

namespace App\Http\Controllers\DocumentTracking;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Events\DashboardUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\DocumentTracking\TrackingActionTaken;
use App\Models\DocumentTracking\TrackingReply;
use App\Models\DocumentTracking\TrackingAssigned;


class DocumentTrackingActionTakenController extends Controller
{
    public function store(Request $request, TrackingReply $reply)
    {
        $request->validate([
            'action_taken_text' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        $action = null;

        DB::transaction(function () use ($request, $reply, $user, &$action) {

            $action = $reply->actionsTaken()->create([
                'action_taken_text' => $request->action_taken_text,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);

            TrackingAssigned::where(
                'tracking_titles_id',
                $reply->tracking_titles_id
            )
                ->where(
                    'ossp_sections_id',
                    $reply->ossp_sections_id
                )
                ->update([
                    'tracking_assigned_statuses_id' => 3,
                    'status_3_date' => now(),
                ]);
        });

        if (!$action) {
            return back()->with(
                'error',
                'Failed to create action.'
            );
        }

        // 3️⃣ Reload ONLY updated assignment
        $assignment = TrackingAssigned::with([
            'section',
            'status',
        ])
            ->where('tracking_titles_id', $reply->tracking_titles_id)
            ->where('ossp_sections_id', $reply->ossp_sections_id)
            ->first();

        // 4️⃣ Broadcast lightweight event
        broadcast(new DashboardUpdated(
            'tracking_action_taken_created',
            [
                'title_id' => $reply->tracking_titles_id,

                'reply_id' => $reply->id,

                'action' => $action->load([
                    'creator',
                ]),

                'assignment' => $assignment,
            ]
        ))->toOthers();

        return back()->with(
            'success',
            'Action Taken added successfully.'
        );
    }

    public function update(Request $request, TrackingActionTaken $actionTaken)
    {
        $request->validate([
            'action_taken_text' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        $actionTaken->update([
            'action_taken_text' => $request->action_taken_text,
            'updated_by' => $user->id,
        ]);

        return back()->with('success', 'Action Taken updated successfully.');
    }

    public function destroy(TrackingActionTaken $actionTaken)
    {
        $actionTaken->delete();

        return back()->with('success', 'Action Taken deleted successfully.');
    }
}
