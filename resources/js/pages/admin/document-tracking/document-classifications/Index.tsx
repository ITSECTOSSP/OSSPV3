import { getColumns } from '@/components/admin/document-tracking/document-classifications/ossp-columns';
import { DataTable } from '@/components/admin/document-tracking/document-classifications/ossp-datatable';
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
import { type BreadcrumbItem } from '@/types';
import { TrackingClassification } from '@/types/document-tracking';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: route('admin-panel.dashboard'),
    },
    {
        title: 'Document Classifications',
        href: route('admin-panel.document-classifications.index'),
    },
];

type Props = {
    trackingClassifications: {
        data: TrackingClassification[];
        current_page: number;
        per_page: number;
        total: number;
    };

    perPage: number;
};

export default function Index({ trackingClassifications, perPage }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TrackingClassification | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDeleteRequest = (item: TrackingClassification) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        setProcessing(true);

        router.delete(
            route('admin-panel.document-classifications.destroy', selectedItem.id),
            {
                onFinish: () => {
                    setProcessing(false);
                    setOpenDialog(false);
                    setSelectedItem(null);
                },
            },
        );
    };

    const handlePerPageChange = (value: number) => {
        router.get(
            route('admin-panel.document-classifications.index'),
            { per_page: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Classifications" />

            <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">

                    {/* HEADER */}
                    <div className="flex items-start justify-between border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">

                        <div className="flex items-start gap-3">
                            <Link
                                href={route('admin-panel.dashboard')}
                                aria-label="Go back"
                                title="Go back"
                                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">
                                    Document Classifications Management
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    List of document classifications used in tracking system.
                                </p>
                            </div>
                        </div>

                        <Button asChild>
                            <Link href={route('admin-panel.document-classifications.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Document Classification
                            </Link>
                        </Button>
                    </div>

                    {/* TABLE */}
                    <DataTable
                        data={trackingClassifications.data}
                        columns={getColumns(handleDeleteRequest, false)}
                        perPage={perPage}
                        onPerPageChange={handlePerPageChange}
                        defaultVisibleColumns={{
                            classifications_name: true,
                            created_at: true,
                            actions: true,
                        }}
                        mobileVisibleColumns={{
                            classifications_name: true,
                            actions: true,
                        }}
                    />

                    {/* DELETE DIALOG */}
                    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete Document Classification?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                    Are you sure you want to delete{' '}
                                    <strong>
                                        {selectedItem?.classifications_name}
                                    </strong>
                                    ? This action cannot be undone.
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
                                    {processing ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>
        </AppLayout>
    );
}