import DeptHeadPending from '@/components/document-tracking/assigned-tracking/cards-tracking-depthead';
import { useRealtimeTitles } from '@/hooks/useRealtimeTitles';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { TrackingTitle } from '@/types/document-tracking';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Props = {
    trackingTitles: TrackingTitle[];
    currentUser: {
        ossp_sections_id: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department Head Dashboard',
        href: route('dashboard'), // use actual route helper
    },
];

export default function Dashboard({ trackingTitles, currentUser }: Props) {
    // ✅ Use realtime hook
    const liveTitles = useRealtimeTitles(trackingTitles);

    // ✅ Filter for department head
    const deptHeadTitles = liveTitles;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department Head Dashboard" />
            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                {/* Status cards */}
                <DeptHeadPending trackingTitles={deptHeadTitles} />
            </div>
        </AppLayout>
    );
}
