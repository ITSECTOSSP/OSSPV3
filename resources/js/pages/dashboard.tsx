import TrackingStatusCards from '@/components/document-tracking/assigned-tracking/card-tracking-status';
import SimilarityCheckingCard from '@/components/legislative-tracking/similarity-checking/similarity-checking-card';

import { useRealtimeTitles } from '@/hooks/useRealtimeTitles';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { TrackingTitle } from '@/types/document-tracking';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Props = {
    currentUser: {
        id: number;
        ossp_sections_id: number;
        section?: {
            name: string;
        };
    };
    trackingTitles: TrackingTitle[];
    similarityTitles: TrackingTitle[];
    docketingTitles: TrackingTitle[];
    userSectionName: string;
};

export default function Dashboard({
    trackingTitles,
    similarityTitles,
    docketingTitles,
    currentUser,
    userSectionName,
}: Props) {
    const liveTitles = useRealtimeTitles(trackingTitles, {
        sectionId: currentUser?.ossp_sections_id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userSectionName || 'Employees Dashboard',
            href: route('dashboard'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={userSectionName || 'Employees Dashboard'} />
            <div className="flex flex-col gap-2">
                {/*Document Tracking by Status*/}
                 <div className="border p-3">
                    <TrackingStatusCards
                        trackingTitles={liveTitles}
                        userSectionId={currentUser?.ossp_sections_id}
                    />
                </div>
                {/*Document Tracking by For Legislative Measures*/}
                 <div className="border p-3">
                    <SimilarityCheckingCard
                        similarityTitles={similarityTitles}
                        docketingTitles={docketingTitles}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
