import { useRealtimeTitles } from '@/hooks/useRealtimeTitles';
import { DataTable } from '@/components/document-tracking/table-tracking/ossp-datatable';
import DocumentFilters from '@/components/document-tracking/table-tracking/ossp-tracking-filter';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OsspSections, Paginated } from '@/types';
import {
    DocumentType,
    TrackingClassification,
    TrackingTitle,
} from '@/types/document-tracking';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

type Props = {
    titles: Paginated<TrackingTitle>;
    filters: {
        per_page: number;
        document_type_id?: string;
        classifications_id?: string;
        search?: string;
        section_id?: string[];
    };
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
    osspSections: OsspSections[];
    divisionId: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Division Monitoring Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard({
    titles,
    filters,
    documentTypes,
    trackingClassification,
    osspSections,
    divisionId,
}: Props) {
    // Delete modal state
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TrackingTitle | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    const liveTitles = useRealtimeTitles(titles.data, {
        divisionId,
    });
    // Sections dropdown filtered by division
    const filteredSections = osspSections.filter(
        (s) => s.ossp_division_id === divisionId,
    );
    // Filter handler
    const handleFilterChange = (key: string, value: string | string[]) => {
        const query: Record<string, any> = { ...filters };
        query[key] = Array.isArray(value) ? value.map(String) : value;

        router.get(route('divchief.tracking'), query, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    // Confirm delete
    const confirmDelete = (item: TrackingTitle) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        setProcessing(true);

        router.delete(route('document-tracking.destroy', selectedItem.id), {
            onFinish: () => {
                setProcessing(false);
                setOpenDialog(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Division Chief Dashboard" />

            <div className="space-y-4 p-4">
                {/* Filters */}
                <DocumentFilters
                    filters={filters}
                    documentTypes={documentTypes}
                    trackingClassification={trackingClassification}
                    osspSections={filteredSections}
                    onFilterChange={handleFilterChange}
                    showSectionFilter={true}
                    showDateAssignedFilter={false}
                />

                {/* Table */}
                <DataTable
                    data={liveTitles}
                    perPage={filters.per_page}
                    onPerPageChange={(value) =>
                        handleFilterChange('per_page', String(value))
                    }
                    onDelete={confirmDelete} // Required prop
                />

                {/* Pagination */}
                <div className="flex justify-center gap-2">
                    {titles.links.map((link, i) => (
                        <a
                            key={i}
                            href={link.url ?? '#'}
                            className={`rounded px-3 py-1 text-sm ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{selectedItem?.titles_dcn}</strong>? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={processing}
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
