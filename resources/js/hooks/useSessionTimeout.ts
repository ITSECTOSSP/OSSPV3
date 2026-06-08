import { router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

export default function useSessionTimeout({
    warningTime = 30 * 1000,
}: {
    warningTime?: number;
}) {
    const timeout = 380 * 1000;

    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(warningTime / 1000);
    const [progress, setProgress] = useState(100);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const logoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const warningTriggered = useRef(false);

    const logout = () => {
        router.post("/logout", {}, {
            onFinish: () => {
                window.location.href = "/login";
            },
        });
    };

    const clearAll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (logoutRef.current) clearTimeout(logoutRef.current);
    };

    const resetTimer = () => {
        clearAll();

        setShowWarning(false);
        setCountdown(warningTime / 1000);
        setProgress(100);
        warningTriggered.current = false;

        const start = Date.now();
        const warningStart = timeout - warningTime;

        logoutRef.current = setTimeout(() => {
            logout();
        }, timeout);

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(timeout - elapsed, 0);

            // trigger warning ONLY ONCE
            if (!warningTriggered.current && elapsed >= warningStart) {
                warningTriggered.current = true;
                setShowWarning(true);
            }

            if (warningTriggered.current) {
                const warnRemaining = Math.max(timeout - elapsed, 0);
                const warnSeconds = Math.ceil(warnRemaining / 1000);

                setCountdown(Math.min(warningTime / 1000, warnSeconds));
                setProgress((warnRemaining / warningTime) * 100);
            }

            if (remaining <= 0) {
                clearAll();
            }
        }, 250);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll"];

        let debounce: ReturnType<typeof setTimeout>;

        const activityHandler = () => {
            clearTimeout(debounce);
            debounce = setTimeout(resetTimer, 500);
        };

        events.forEach((e) =>
            window.addEventListener(e, activityHandler),
        );

        resetTimer();

        return () => {
            events.forEach((e) =>
                window.removeEventListener(e, activityHandler),
            );

            clearAll();
        };
    }, []);

    return { showWarning, countdown, resetTimer, progress };
}