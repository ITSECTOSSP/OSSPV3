import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackingTitle } from '@/types/document-tracking';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Props = {
    titles: TrackingTitle[];
};

export default function SimilarityList({ titles }: Props) {
    const pill =
        'rounded-full px-2 py-1 text-[11px] font-medium whitespace-nowrap';

    const typeColors: Record<number, string> = {
        1: 'bg-amber-100 text-amber-700',
        2: 'bg-lime-100 text-lime-700',
        3: 'bg-purple-100 text-purple-700',
        4: 'bg-orange-100 text-orange-700',
        5: 'bg-teal-100 text-teal-700',
        6: 'bg-emerald-100 text-emerald-700',
        7: 'bg-pink-100 text-pink-700',
        8: 'bg-sky-100 text-sky-700',
        9: 'bg-indigo-100 text-indigo-700',
    };

    const classificationColors: Record<number, string> = {
        1: 'bg-cyan-100 text-cyan-700',
        2: 'bg-rose-100 text-rose-700',
        3: 'bg-fuchsia-100 text-fuchsia-700',
        4: 'bg-yellow-100 text-yellow-700',
        5: 'bg-blue-100 text-blue-700',
        6: 'bg-emerald-100 text-emerald-700',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                    Similarity Checking
                </h2>

                <Badge>{titles.length}</Badge>
            </div>

            {titles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No documents found.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {titles.map((tracking) => {
                        const typeId = Number(
                            tracking.document_type?.id,
                        );

                        const classificationId = Number(
                            tracking.document_classifications?.id,
                        );

                        return (
                            <Link
                                key={tracking.id}
                                href={route(
                                    'document-tracking.manage',
                                    tracking.id,
                                )}
                                className="group"
                            >
                                <Card
                                    className="
                                        h-full
                                        border
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:-translate-y-1
                                        hover:shadow-md
                                    "
                                >
                                    <CardHeader className="space-y-2 pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-sm leading-snug group-hover:text-primary transition">
                                                {tracking.titles_dcn}
                                            </CardTitle>

                                            {tracking.document_type && (
                                                <span
                                                    className={`${pill} ${
                                                        typeColors[
                                                            typeId
                                                        ] ??
                                                        'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {
                                                        tracking
                                                            .document_type
                                                            .types_name
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {tracking.titles_title}
                                        </p>
                                    </CardHeader>

                                    <CardContent className="space-y-3 text-sm">
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                                            <span className="text-muted-foreground">
                                                From
                                            </span>

                                            <span className="font-medium">
                                                {tracking.titles_from || '-'}
                                            </span>

                                            <span className="text-muted-foreground">
                                                Subject
                                            </span>

                                            <span className="line-clamp-1 font-medium">
                                                {tracking.titles_subject ||
                                                    '-'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {tracking.document_classifications && (
                                                <span
                                                    className={`${pill} ${
                                                        classificationColors[
                                                            classificationId
                                                        ] ??
                                                        'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {
                                                        tracking
                                                            .document_classifications
                                                            .classifications_name
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <div className="pt-2 text-[11px] text-muted-foreground">
                                            Created:{' '}
                                            <span className="font-medium text-foreground">
                                                {tracking.created_at
                                                    ? new Date(
                                                          tracking.created_at,
                                                      ).toLocaleString()
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}