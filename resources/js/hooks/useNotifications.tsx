import Echo from '@/lib/echo';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { route } from 'ziggy-js';

export function useNotifications(userId: number, userSectionId?: number) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const shownToastIdsRef = useRef(new Set<string>());

    useEffect(() => {
        if (!userId) return;

        // Load existing notifications
        axios
            .get('/notifications')
            .then((res) => {
                let oldNotifications: any[] = res.data || [];

                if (userSectionId) {
                    oldNotifications = oldNotifications.filter(
                        (n) => !n.section_id || n.section_id === userSectionId,
                    );
                }

                setNotifications(oldNotifications);
            })
            .catch((err) => console.error('Fetch notifications failed:', err));

        // Listen for real-time notifications
        const channelName = `App.Models.User.${userId}`;
        const channel = Echo.private(channelName);

        // Prevent duplicate listeners
        channel.stopListening(
            '.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated',
        );

        channel.notification((notification: any) => {
            const data = notification.data || notification;

            // 🚫 Prevent duplicate toast
            if (shownToastIdsRef.current.has(data.id)) return;
            shownToastIdsRef.current.add(data.id);
            const message =
                data.message ??
                data.title_name ??
                data.full_title?.titles_title ??
                'New update';

            const url =
                data.url ??
                (data.title_id
                    ? route('document-tracking.manage', data.title_id)
                    : '#');

            // Show toast
            toast.info(
                <div className="flex items-start gap-3">
                    {data.actor_avatar ? (
                        <img
                            src={data.actor_avatar}
                            alt={data.actor_name}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm text-gray-600">
                            {data.actor_name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                    )}

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">
                            {data.actor_name ?? 'IOSSP'}
                        </span>
                        <span className="text-sm text-gray-700">{message}</span>
                        {data.title_name || data.full_title?.titles_title ? (
                            <span className="text-xs text-gray-400">
                                {data.title_name ??
                                    data.full_title?.titles_title}
                            </span>
                        ) : null}
                    </div>
                </div>,
                { position: 'top-right', autoClose: 4000, icon: false },
            );

            // Normalize notification object
            const newNotification = {
                id: data.id,
                message,
                title_id: data.title_id ?? null,
                title_name:
                    data.title_name ?? data.full_title?.titles_title ?? null,
                section_id: data.section_id ?? null,
                actor_name: data.actor_name ?? null,
                actor_avatar: data.actor_avatar ?? null,
                type: data.type ?? 'info',
                url,
                read_at: null,
                created_at: data.created_at ?? new Date().toISOString(),
            };

            setNotifications((prev) => {
                if (prev.some((n) => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });
        });

        return () => {
            Echo.leave(channelName);
        };
    }, [userId, userSectionId]);

    return [notifications, setNotifications] as const;
}
