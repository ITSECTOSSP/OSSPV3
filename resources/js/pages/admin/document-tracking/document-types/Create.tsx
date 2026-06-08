import NameForm from '@/components/nameform';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: route('admin-panel.dashboard'),
    },
    {
        title: 'Document Types',
        href: route('admin-panel.document-types.index'),
    },
    {
        title: 'Create Document Type',
        href: '#',
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Document Type" />

            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                <div className="align-self-center m-4 mx-auto w-full justify-self-center rounded-xl border p-4 md:mx-auto md:my-6 md:w-7/9">
                    {/* Header */}
                    <div className="relative mb-4 flex items-center">
                        <Link
                            href={route('admin-panel.document-types.index')}
                            className="z-10 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <h2 className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-xl font-semibold tracking-tight">
                            <Plus className="h-7 w-7 text-primary" />
                            NEW DOCUMENT TYPE
                        </h2>
                    </div>

                    <Separator className="m-4" />

                    <NameForm
                        id={undefined}
                        initialValue=""
                        fieldName="types_name"
                        label="Document Type"
                        placeholder="Enter document type"
                        storeRoute={route('admin-panel.document-types.store')}
                        updateRoute={(id) =>
                            route('admin-panel.document-types.update', id)
                        }
                        createText="Create Document Type"
                        updateText="Update Document Type"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
