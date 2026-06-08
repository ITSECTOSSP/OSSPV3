import { Card, CardContent } from '@/components/ui/card';
import { TrackingTitle } from '@/types/document-tracking';
import { router } from '@inertiajs/react';
import { CheckCircle, Clock, Inbox } from 'lucide-react';
import { useMemo } from 'react';
import { route } from 'ziggy-js';

type Props = {
    trackingTitles: TrackingTitle[];
    userSectionId: number;
};

export default function TrackingStatusCards({
    trackingTitles,
    userSectionId,
}: Props) {
    /**
     * ✅ OPTIMIZED: compute once instead of recalculating per card
     */
    const assignments = useMemo(() => {
        return trackingTitles.flatMap((t) =>
            (t.assignments ?? []).filter(
                (a) => Number(a.section?.id) === Number(userSectionId),
            ),
        );
    }, [trackingTitles, userSectionId]);

    const statusData = useMemo(
        () => [
            {
                id: 1,
                title: 'Assigned',
                icon: Inbox,
                count: assignments.filter((a) => a.status?.id === 1).length,
                accent: 'bg-amber-500',
                glow: 'bg-amber-400/20',
                iconBg: 'bg-amber-100 dark:bg-amber-500/20',
                iconColor: 'text-amber-600 dark:text-amber-300',
            },
            {
                id: 2,
                title: 'Received',
                icon: Clock,
                count: assignments.filter((a) => a.status?.id === 2).length,
                accent: 'bg-blue-500',
                glow: 'bg-blue-400/20',
                iconBg: 'bg-blue-100 dark:bg-blue-500/20',
                iconColor: 'text-blue-600 dark:text-blue-300',
            },
            {
                id: 3,
                title: 'Accomplished',
                icon: CheckCircle,
                count: assignments.filter((a) => a.status?.id === 3).length,
                accent: 'bg-green-500',
                glow: 'bg-green-400/20',
                iconBg: 'bg-green-100 dark:bg-green-500/20',
                iconColor: 'text-green-600 dark:text-green-300',
            },
        ],
        [assignments],
    );

    return (
        <div className="space-y-6 pb-4">
            {/* HEADER */}
            <div className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-start">
                    {/* Title */}
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Document Tracking
                    </h2>

                </div>

                {/* Subtitle */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                    User section overview — track assigned documents and their
                    progress across workflows
                </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statusData.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card
                            key={card.id}
                            onClick={() =>
                                router.visit(
                                    route('document-tracking.status', {
                                        status: card.id,
                                    }),
                                )
                            }
                            className="relative cursor-pointer overflow-hidden border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                        >
                            {/* ACCENT BAR */}
                            <div
                                className={`absolute top-0 left-0 h-full w-1 ${card.accent}`}
                            />

                            {/* SOFT GLOW */}
                            <div
                                className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl ${card.glow}`}
                            />

                            <CardContent className="relative flex items-center justify-between p-6">
                                {/* LEFT TEXT */}
                                <div className="space-y-1">
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        {card.title}
                                    </p>

                                    <p className="text-4xl font-bold tracking-tight">
                                        {card.count}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Click to view details
                                    </p>
                                </div>

                                {/* ICON */}
                                <div
                                    className={`rounded-xl p-3 ${card.iconBg}`}
                                >
                                    <Icon
                                        className={`h-6 w-6 ${card.iconColor}`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
