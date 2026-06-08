import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrackingTitle } from '@/types/document-tracking';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Props = {
    trackingTitles: TrackingTitle[];
};

export default function DeptHeadPending({ trackingTitles }: Props) {
    // Filter: only notify_depthead = true AND zero assignments
    const pendingTitles = trackingTitles.filter(
        (t) =>
            t.notify_depthead && (!t.assignments || t.assignments.length === 0),
    );

    const typeColors: Record<number, string> = {
        1: 'bg-amber-100 text-amber-700',
        2: 'bg-lime-100 text-lime-700',
        3: 'bg-purple-100 text-purple-700',
        4: 'bg-orange-100 text-orange-700',
        5: 'bg-teal-100 text-teal-700',
        6: 'bg-emerald-100 text-emerald-700',
        7: 'bg-pink-100 text-pink-700',
    };

    if (pendingTitles.length === 0) {
        return (
            <>
                <h2 className="m-2 text-xl font-semibold tracking-tight">
                    Document Tracking
                </h2>
                <p className="m-2 text-sm text-muted-foreground">
                    Office Suite for Streamlined Paperwork and Quality
                    Cataloguing
                </p>
                <p className="m-4 text-muted-foreground">
                    No pending notifications for Dept. Head.
                </p>
            </>
        );
    }
    return (
        <div className="space-y-6">
            <div className="space-y-3 pb-2">
                <h2 className="m-2 text-xl font-semibold tracking-tight">
                    Document Tracking
                </h2>
                <p className="m-2 text-sm text-muted-foreground">
                    Office Suite for Streamlined Paperwork and Quality
                    Cataloguing
                </p>

                {/* Flex row for pending and badge */}
                <div className="m-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                        Pending Dept. Head Notifications
                    </h2>
                    <Badge>{pendingTitles.length}</Badge>
                </div>
            </div>
            <Separator className="mb-2" />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pendingTitles.map((tracking) => (
                    <Link
                        key={tracking.id}
                        href={route('document-tracking.manage', tracking.id)}
                        className="block"
                    >
                        <Card className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between gap-2">
                                    <CardTitle className="text-base">
                                        {tracking.titles_dcn}
                                    </CardTitle>

                                    {tracking.document_type &&
                                        (() => {
                                            const typeId = Number(
                                                tracking.document_type.id,
                                            );
                                            const colorClass =
                                                typeColors[typeId] ??
                                                'bg-gray-100 text-gray-700'; // fallback

                                            return (
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}
                                                >
                                                    {
                                                        tracking.document_type
                                                            .types_name
                                                    }
                                                </span>
                                            );
                                        })()}
                                </div>

                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {tracking.titles_title}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-3 text-sm">
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                                    <div className="text-muted-foreground">
                                        From
                                    </div>
                                    <div className="font-medium">
                                        {tracking.titles_from || 'N/A'}
                                    </div>

                                    <div className="text-muted-foreground">
                                        Subject
                                    </div>
                                    <div className="line-clamp-2 font-medium">
                                        {tracking.titles_subject || 'N/A'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
