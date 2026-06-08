<?php

namespace App\Http\Controllers\DocumentTracking;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Events\DashboardUpdated;

use App\Models\DocumentTracking\TrackingReply;
use App\Models\DocumentTracking\TrackingTitle;
use App\Models\DocumentTracking\TrackingAssigned;


class DocumentTrackingReplyController extends Controller
{
    public function store(Request $request, TrackingTitle $item)
    {
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($request, $item, $user) {

            // 1. create reply
            $reply = TrackingReply::create([
                'tracking_titles_id' => $item->id,
                'reply_remarks' => $request->remarks,
            ]);

            // 2. update assignment
            TrackingAssigned::where('tracking_titles_id', $item->id)
                ->where('ossp_sections_id', $user->ossp_sections_id)
                ->where('tracking_assigned_statuses_id', 1)
                ->update([
                    'tracking_assigned_statuses_id' => 2,
                    'status_2_date' => now(),
                ]);

            // 3. reload FULL title AFTER changes
            $title = TrackingTitle::select(
                'id',
                'titles_dcn',
                'titles_title',
                'notify_depthead',
                'updated_at'
            )
                ->find($item->id);

            // 4. broadcast ONE unified event
            broadcast(new DashboardUpdated(
                'tracking_reply_created',
                [
                    'title_id' => $item->id,

                    'reply' => $reply->load([
                        'creator',
                        'section',
                    ]),

                    'title' => $title,
                ]
            ));
        });

        return redirect()
            ->route('document-tracking.manage', $item)
            ->with('success', 'Reply added successfully.');
    }

    public function update(Request $request, TrackingReply $reply)
    {
        // 1️⃣ Validate the input
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $item = $reply->title->id;
        // 2️⃣ Optional: Ensure the user can only edit their own reply
        if ($reply->created_by !== $user->id) {
            abort(403, 'You are not authorized to edit this reply.');
        }

        // 3️⃣ Update the reply remarks
        $reply->update([
            'reply_remarks' => $request->remarks,
        ]);

        return redirect()
            ->route('document-tracking.manage', $item)
            ->with('success', 'Reply updated successfully.');
    }

    public function destroy(TrackingReply $reply)
    {

        $item = $reply->title->id;

        $reply->delete();

        return
            redirect()
            ->route('document-tracking.manage', $item)
            ->with('success', 'Reply deleted successfully.');
    }
}
