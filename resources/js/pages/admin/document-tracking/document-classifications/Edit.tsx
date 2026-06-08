import NameForm from '@/components/nameform';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { route } from 'ziggy-js';

type Props = {
    trackingClassifications: {
        id: number;
        classifications_name: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: route('admin-panel.dashboard'),
    },
    {
        title: 'Document Classifications',
        href: route('admin-panel.document-classifications.index'),
    },
    {
        title: 'Edit Document Classification',
        href: '#',
    },
];

export default function Edit({ trackingClassifications }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Document Classification" />

            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                <div className="m-4 mx-auto w-full rounded-xl border p-4 md:w-7/9">

                    {/* Header */}
                    <div className="relative mb-4 flex items-center">
                        <Link
                            href={route('admin-panel.document-classifications.index')}
                            className="z-10 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <h2 className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-xl font-semibold tracking-tight">
                            <Pencil className="h-6 w-6 text-primary" />
                            Edit Document Classification
                        </h2>
                    </div>

                    <Separator className="m-4" />

                    <NameForm
                        id={trackingClassifications.id}
                        initialValue={trackingClassifications.classifications_name}
                        fieldName="classifications_name"
                        label="Document Classification"
                        placeholder="Enter document classification"
                        storeRoute={route('admin-panel.document-classifications.store')}
                        updateRoute={(id) =>
                            route('admin-panel.document-classifications.update', id)
                        }
                        createText="Create Document Classification"
                        updateText="Update Document Classification"
                    />
                </div>
            </div>
        </AppLayout>
    );
}