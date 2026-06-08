import { useRealtimeTitles } from '@/hooks/useRealtimeTitles';
import TrackingCards from '@/components/document-tracking/assigned-tracking/cards-tracking';
import DocumentFilters from '@/components/document-tracking/table-tracking/ossp-tracking-filter';
import AppLayout from '@/layouts/app-layout';
import { OsspSections, type BreadcrumbItem } from '@/types';
import {
    DocumentType,
    TrackingClassification,
    TrackingTitle,
} from '@/types/document-tracking';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

type Props = {
    trackingTitles: TrackingTitle[];
    userSectionId: number;
    statusId: number;
    statusName: string;
    filters: {
        per_page: number;
        search?: string;
        document_type_id?: string;
        classifications_id?: string;
        section_id?: string[];
    };
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
    osspSections: OsspSections[];
};

export default function DocumentTrackingByStatus({
    trackingTitles,
    userSectionId,
    statusId,
    statusName,
    filters,
    documentTypes,
    trackingClassification,
    osspSections,
}: Props) {
    const [currentFilters, setCurrentFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string | string[]) => {
        const updatedFilters = {
            ...currentFilters,
            [key]: value,
        };

        setCurrentFilters(updatedFilters);

        // Only send filters that have values
        const query: Record<string, any> = {
            status: statusId,
        };

        Object.entries(updatedFilters).forEach(([k, v]) => {
            if (v !== '' && !(Array.isArray(v) && v.length === 0)) {
                query[k] = v;
            }
        });

        router.get(route('document-tracking.status'), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

   const liveTitles = useRealtimeTitles(trackingTitles, {
    sectionId: userSectionId,
    statusId: statusId,
});

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Document Tracking',
            href: route('dashboard'),
        },
        {
            title: statusName,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Document - ${statusName}`} />

            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                <DocumentFilters
                    filters={currentFilters}
                    documentTypes={documentTypes}
                    trackingClassification={trackingClassification}
                    osspSections={osspSections}
                    onFilterChange={handleFilterChange}
                    showSectionFilter={false}
                    showDateAssignedFilter={true}
                />

                <TrackingCards
                    trackingTitles={liveTitles}
                    userSectionId={userSectionId}
                    filterStatus={statusId}
                />
            </div>
        </AppLayout>
    );
}
