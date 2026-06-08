import { Card, CardContent } from '@/components/ui/card';
import { TrackingTitle } from '@/types/document-tracking';
import { Clock, Inbox } from 'lucide-react';
import { useMemo, useState } from 'react';
import SimilarityList from './similarity-checking-card-list';

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

    const [selected, setSelected] = useState<'similarity' | 'docketing' | null>(
        null,
    );

    const getKey = (id: number) =>
        id === 1 ? 'similarity' : ('docketing' as const);

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
                            onClick={() =>
                                setSelected((prev) =>
                                    prev === getKey(card.id)
                                        ? null
                                        : getKey(card.id),
                                )
                            }
                            className={`relative cursor-pointer overflow-hidden border bg-background shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${
                                selected === getKey(card.id)
                                    ? `translate-x-[2px] scale-[1.02] border-primary/30 bg-primary/5 shadow-lg ring-1 shadow-primary/10 ring-primary/30`
                                    : ''
                            } `}
                        >
                            {/* Accent bar */}
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${selected === getKey(card.id) ? 'w-1.5' : 'w-1'} ${
                                    card.id === 1
                                        ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600'
                                        : 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600'
                                } `}
                            >
                                {/* glow aura */}
                                <div
                                    className={`absolute inset-0 blur-lg transition-opacity duration-300 ${selected === getKey(card.id) ? 'opacity-100' : 'opacity-0'} ${
                                        card.id === 1
                                            ? 'bg-amber-400/40'
                                            : 'bg-blue-400/40'
                                    } `}
                                />
                            </div>

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
            {/* DETAILS LIST */}
            <div className="flex w-full flex-col">
                {selected === 'similarity' && (
                    <SimilarityList titles={similarityTitles} />
                )}

                {selected === 'docketing' && (
                    <SimilarityList titles={docketingTitles} />
                )}
            </div>
        </div>
    );
}
