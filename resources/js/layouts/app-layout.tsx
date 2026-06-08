import NotificationBell from '@/components/notifications/notification-bell';
import { useNotifications } from '@/hooks/useNotifications';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

// Session Modal
import SessionWarningModal from '@/components/notifications/session-warning';
import useSessionTimeout from '@/hooks/useSessionTimeout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const { auth, flash, errors } = usePage<SharedData>().props as any;

    const user = auth?.user;

    // SESSION TIMEOUT
    const { showWarning, countdown, resetTimer, progress } =
        useSessionTimeout({
            warningTime: 30 * 1000,
        });

    // NOTIFICATIONS
    const [notifications, setNotifications] = user
        ? useNotifications(user.id, user.ossp_sections_id ?? undefined)
        : [[], (() => {}) as React.Dispatch<React.SetStateAction<any[]>>];

    // ✅ GLOBAL TOAST HANDLER (THIS IS THE FIX)
    useEffect(() => {
        if (!errors) return;

        const messages = Object.values(errors).filter(Boolean);

        if (messages.length > 0) {
            toast.error(messages[0] as string);
        }
    }, [errors]);

    // ✅ FLASH MESSAGES (success / error from backend)
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}

                {/* Toast container (ONLY ONCE IN APP) */}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    newestOnTop
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                {/* Notification bell */}
                {user && (
                    <div className="fixed top-4 right-4 z-50">
                        <NotificationBell
                            notifications={notifications}
                            setNotifications={setNotifications}
                        />
                    </div>
                )}
            </AppLayoutTemplate>

            <SessionWarningModal
                show={showWarning}
                countdown={countdown}
                progress={progress}
                onStay={resetTimer}
            />
        </>
    );
}