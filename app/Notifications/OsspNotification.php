<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Support\Str;

class OsspNotification extends Notification implements ShouldBroadcastNow
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public string $uuid;
    public $createdAt;

    public function __construct(
        public $title,
        public $message,
        public $type,
        public $actor // 👈 who triggered it
    ) {
        $this->uuid = (string) Str::uuid();   // ✅ stable unique ID
        $this->createdAt = now();             // ✅ same timestamp everywhere
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast', 'mail']; // ✅ consistent channels
    }

    public function toDatabase($notifiable)
    {
        return [
            'id' => $this->uuid, // ✅ use custom UUID
            'title_id' => $this->title->id,
            'title_name' => $this->title->titles_title,
            'message' => $this->message,
            'type' => $this->type,
            'actor_id' => $this->actor->id,
            'actor_name' => $this->actor->name,
            'actor_avatar' => $this->actor->avatar ?? null,
            'section_id' => $notifiable->ossp_sections_id ?? null,
            'created_at' => $this->createdAt, // ✅ same timestamp
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->uuid, // ✅ SAME UUID
            'title_id' => $this->title->id,
            'title_name' => $this->title->titles_title,
            'message' => $this->message,
            'type' => $this->type,
            'actor_name' => $this->actor->name,
            'actor_avatar' => $this->actor->avatar ?? null,
            'section_id' => $notifiable->ossp_sections_id ?? null,
            'created_at' => $this->createdAt, // ✅ SAME timestamp
            'url' => "/document-tracking/manage/{$this->title->id}",
        ]);
    }
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url("/document-tracking/manage/{$this->title->id}");

        return (new MailMessage)
            ->subject(
                '[DCN: ' . $this->title->titles_dcn . '] IOSSP Document Tracking Notification'
            )
            ->greeting('Good Day!')
            ->line($this->message)
            ->line('DCN: ' . $this->title->titles_dcn)
            ->line('Tracking Title: ' . $this->title->titles_title)
            ->line('From: ' . $this->title->titles_from)
            ->line('Subject: ' . $this->title->titles_subject)
            ->line('Action By: ' . $this->actor->name)
            ->action('View Tracking', $url)
            ->line('Thank you for using IOSSP Tracking System.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'id' => $this->uuid,
            'message' => $this->message,
            'url' => "/document-tracking/manage/{$this->title->id}",
            'read_at' => null,
            'created_at' => $this->createdAt,
        ];
    }
}
