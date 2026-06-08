import { Card, CardContent } from '@/components/ui/card';
import { TrackingTitle } from '@/types/document-tracking';
import { Clock, Inbox } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
    similarityTitles: TrackingTitle[];
    docketingTitles: TrackingTitle[];
};

export default function SimilarityCheckingCard({
    similarityTitles,
    docketingTitles,
}: Props) {
    const statusData = useMemo(
        () => [
            {
                id: 1,
                title: 'For Similarity Checking',
                icon: Inbox,
                count: similarityTitles.length,
                accent: 'bg-amber-500',
                glow: 'bg-amber-400/20',
                iconBg: 'bg-amber-100 dark:bg-amber-500/20',
                iconColor: 'text-amber-600 dark:text-amber-300',
            },
            {
                id: 2,
                title: 'For Docketing',
                icon: Clock,
                count: docketingTitles.length,
                accent: 'bg-blue-500',
                glow: 'bg-blue-400/20',
                iconBg: 'bg-blue-100 dark:bg-blue-500/20',
                iconColor: 'text-blue-600 dark:text-blue-300',
            },
        ],
        [similarityTitles, docketingTitles],
    );

    return (
        <div className="space-y-6 pb-4">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                    Similarity Checking and Docketing of Legislative Measures
                </h2>

                <p className="text-sm text-muted-foreground">
                    Filtered by document type 8/9 and classification 5/6
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statusData.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card
                            key={card.id}
                            className="relative cursor-pointer overflow-hidden border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div
                                className={`absolute top-0 left-0 h-full w-1 ${card.accent}`}
                            />
                            <div
                                className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl ${card.glow}`}
                            />

                            <CardContent className="relative flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        {card.title}
                                    </p>

                                    <p className="text-4xl font-bold">
                                        {card.count}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Click to view details
                                    </p>
                                </div>

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
