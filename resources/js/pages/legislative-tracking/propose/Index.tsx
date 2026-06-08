import { DataTable } from '@/components/legislative-tracking/table-tracking/propose/ossp-datatable';
import DocumentFilters from '@/components/legislative-tracking/table-tracking/propose/ossp-tracking-filter';
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
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Paginated } from '@/types';
import {
    LegislativeProposed,
    LegislativeMeasureType,
} from '@/types/legislative-tracking';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Legislative Data Tracking',
        href: route('legislative-tracking.propose.index'),
    },
];

type Props = {
    proposes: Paginated<LegislativeProposed>;
    filters: {
        per_page: number;
        measure_type_id?: string;
        search?: string; // <-- add search
    };
    measureType: LegislativeMeasureType[];
};

export default function Index({ proposes, filters, measureType }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] =
        useState<LegislativeProposed | null>(null);
    const [processing, setProcessing] = useState(false);

    // Called from Actions dropdown
    const confirmDelete = (item: LegislativeProposed) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        setProcessing(true);

        router.delete(route('legislative-tracking.propose.destroy', selectedItem.id), {
            onFinish: () => {
                setProcessing(false);
                setOpenDialog(false);
            },
        });
    };

    // Update filters / per_page dynamically
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('legislative-tracking.propose.index'),
            { ...filters, [key]: value === 'all' ? '' : value },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Legislative Data Tracking" />
            <div className="flex items-center justify-between p-4">
                <Link href={route('legislative-tracking.propose.create')}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Measure
                    </Button>
                </Link>
            </div>
            <DocumentFilters
                filters={filters}
                measureType={measureType}
                onFilterChange={handleFilterChange}
            />

            {/* Data Table */}
            <DataTable
                data={proposes.data}
                onDelete={confirmDelete}
                perPage={filters.per_page} // pass current per_page
                onPerPageChange={
                    (value: number) =>
                        handleFilterChange('per_page', String(value)) // update filter
                }
            />

            {/* Pagination Links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {proposes.links.map((link, i) => {
                    // hide extra page numbers on mobile
                    const isPageNumber =
                        !isNaN(Number(link.label)) && Number(link.label) > 0;

                    return (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            preserveState
                            className={`rounded-md px-3 py-1 text-sm transition ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border hover:bg-muted'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''} /* mobile behavior */ ${
                                isPageNumber && !link.active
                                    ? 'hidden sm:inline-flex'
                                    : 'inline-flex'
                            } `}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{selectedItem?.propose_no}</strong>? This
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
