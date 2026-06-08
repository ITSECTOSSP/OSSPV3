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
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import Echo from '@/lib/echo';
import { BreadcrumbItem, OsspSections, Paginated } from '@/types';
import {
    DocumentType,
    TrackingClassification,
    TrackingTitle,
} from '@/types/document-tracking';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Tracking',
        href: route('document-tracking.index'),
    },
];

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
    onFilterChange: (key: string, value: string | string[]) => void;
};

export default function Index({
    titles,
    filters,
    documentTypes,
    trackingClassification,
    osspSections,
}: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TrackingTitle | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    // Live state for realtime updates
    const [liveTitles, setLiveTitles] = useState<TrackingTitle[]>(titles.data);

    // If Inertia reloads data (filters, pagination), resync state
    useEffect(() => {
        setLiveTitles(titles.data);
    }, [titles.data]);

    // Reverb Listener
    useEffect(() => {
        const channel = Echo.channel('dashboard');

        // Prevent duplicate listeners
        channel.stopListening('.dashboard.updated');

        channel.listen('.dashboard.updated', (event: any) => {
            console.log('Realtime update:', event);

            const updated = event.data;

            // CREATE
            if (event.type === 'tracking_title_created') {
                setLiveTitles((prev) => [updated, ...prev]);
            }

            // UPDATE
            if (event.type === 'tracking_title_updated') {
                setLiveTitles((prev) =>
                    prev.map((item) =>
                        item.id === updated.id
                            ? { ...item, ...updated } // merge to preserve relationships
                            : item,
                    ),
                );
            }

            // DELETE
            if (event.type === 'tracking_title_deleted') {
                setLiveTitles((prev) =>
                    prev.filter((item) => item.id !== updated.id),
                );
            }

            // ASSIGNMENTS
            if (event.type === 'tracking_assigned_updated') {
                const { title_id, assignments } = event.data;

                setLiveTitles((prev) =>
                    prev.map((item) =>
                        item.id === title_id ? { ...item, assignments } : item,
                    ),
                );
            }

            // REPLIES
            if (event.type === 'tracking_reply_created') {
                setLiveTitles((prev) =>
                    prev.map((item) =>
                        item.id === event.title_id
                            ? {
                                  ...item,
                                  replies: [
                                      ...(item.replies || []),
                                      event.data,
                                  ],
                              }
                            : item,
                    ),
                );
            }

            // FILES
            if (event.type === 'tracking_files_uploaded') {
                setLiveTitles((prev) =>
                    prev.map((item) =>
                        item.id === event.title_id
                            ? {
                                  ...item,
                                  files: [...(item.files || []), event.data],
                              }
                            : item,
                    ),
                );
            }
        });

        return () => {
            Echo.leaveChannel('dashboard');
        };
    }, []);

    // Called from Actions dropdown
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

    // Update filters / per_page dynamically
    const handleFilterChange = (key: string, value: string | string[]) => {
        const query: Record<string, any> = { ...filters };

        if (Array.isArray(value)) {
            query[key] = value.map(String);
        } else {
            query[key] = value;
        }

        router.get(route('document-tracking.index'), query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Tracking" />
            <div className="flex items-center justify-between p-4">
                <Link href={route('document-tracking.create')}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Document
                    </Button>
                </Link>
            </div>

            <DocumentFilters
                filters={filters}
                documentTypes={documentTypes}
                trackingClassification={trackingClassification}
                osspSections={osspSections}
                onFilterChange={handleFilterChange}
                showSectionFilter={true}
                showDateAssignedFilter={false}
            />

            {/* Info about number of results */}
            <div className="m-2 flex items-end justify-end text-sm text-muted-foreground">
                <div>
                    Showing{' '}
                    <span className="font-semibold">{titles.data.length}</span>{' '}
                    of <span className="font-semibold">{titles.total}</span>{' '}
                    results
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                data={liveTitles} // <-- use live state
                onDelete={confirmDelete}
                perPage={filters.per_page}
                onPerPageChange={(value: number) =>
                    handleFilterChange('per_page', String(value))
                }
            />

            {/* Pagination Links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {titles.links.map((link, i) => {
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
