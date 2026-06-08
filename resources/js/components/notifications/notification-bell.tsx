import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell } from 'lucide-react';
import { useRef, useState } from 'react';

dayjs.extend(relativeTime);

interface Notification {
    id: string;
    message: string;
    url: string;
    title_name?: string;
    read_at: string | null;
    created_at: string;
    actor_name?: string;
    actor_avatar?: string;
}

export default function NotificationBell({
    notifications,
    setNotifications,
}: {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}) {
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    // ✅ persistent lock across renders
    const navigatingRef = useRef(false);

    const handleClick = (n: Notification) => {
        if (navigatingRef.current) return;
        navigatingRef.current = true;

        // fire-and-forget (DO NOT block navigation)
        if (!n.read_at) {
            axios.post(`/notifications/${n.id}/read`).catch(console.error);
        }

        window.location.href = n.url;
    };

    const markAllRead = async () => {
        try {
            await axios.post('/notifications/read-all');
            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    read_at: new Date().toISOString(),
                })),
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative">
            {/* Bell icon */}
            <div
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted"
            >
                <Bell className="h-5 w-5 text-foreground" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* Popup */}
            {open && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b border-border px-4 py-2">
                        <span className="text-sm font-semibold text-foreground">
                            Notifications
                        </span>

                        <button
                            onClick={markAllRead}
                            className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                        >
                            Mark all as read
                        </button>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className={`flex cursor-pointer items-start gap-3 border-b border-border p-3 transition-colors hover:bg-accent/50 ${
                                        !n.read_at
                                            ? 'bg-blue-50 dark:bg-blue-950/40'
                                            : ''
                                    }`}
                                    style={{
                                        pointerEvents: navigatingRef.current
                                            ? 'none'
                                            : 'auto',
                                    }}
                                >
                                    {/* Avatar */}
                                    {n.actor_avatar ? (
                                        <img
                                            src={n.actor_avatar}
                                            alt={n.actor_name}
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                                            {n.actor_name
                                                ?.charAt(0)
                                                ?.toUpperCase() ?? 'I'}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="text-sm font-semibold text-foreground">
                                            {n.actor_name ?? 'IOSSP'}
                                        </div>

                                        <div className="text-sm whitespace-pre-line text-muted-foreground">
                                            {n.message}
                                        </div>

                                        {n.title_name && (
                                            <span className="mt-1 text-xs text-muted-foreground">
                                                📄 {n.title_name}
                                            </span>
                                        )}

                                        <span className="mt-1 text-[11px] text-muted-foreground opacity-70">
                                            {dayjs(n.created_at).fromNow()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
