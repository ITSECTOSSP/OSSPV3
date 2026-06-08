<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return
            $request->user()
            ->notifications()
            ->latest()
            ->take(20)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'message' => $n->data['message'] ?? null,
                'title_id' => $n->data['title_id'] ?? null,
                'title_name' => $n->data['title_name'] ?? null,
                'section_id' => $n->data['section_id'] ?? null,
                'actor_name' => $n->data['actor_name'] ?? null,
                'actor_avatar' => $n->data['actor_avatar'] ?? null,
                'type' => $n->data['type'] ?? 'info',
                'url' => $n->data['title_id']
                    ? "/document-tracking/manage/{$n->data['title_id']}"
                    : '#',
                'read_at' => $n->read_at,
                'created_at' => $n->created_at,
            ]);
    }

    public function unread(Request $request)
    {
        return $request->user()
            ->unreadNotifications
            ->count();
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request)
    {
        $request->user()
            ->unreadNotifications
            ->markAsRead();

        return response()->json(['success' => true]);
    }
}
