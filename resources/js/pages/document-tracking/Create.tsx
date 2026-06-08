import TrackingTitleForm from '@/components/document-tracking/forms/ossp-tracking-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    DocumentType,
    TrackingClassification,
} from '@/types/document-tracking';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { route } from 'ziggy-js';
import { ArrowLeft, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Tracking',
        href: route('document-tracking.index'),
    },
    {
        title: 'Create DCN',
        href: '#',
    },
];

type CreateProps = {
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
};

export default function Index({
    documentTypes,
    trackingClassification,
}: CreateProps) {
    const uploadToken = useRef(uuidv4());

    const { data, setData, post, processing, errors, reset } = useForm({
        titles_dcn: '',
        titles_from: '',
        titles_subject: '',
        titles_title: '',
        document_type_id: '',
        classifications_id: '',
        upload_token: uploadToken.current,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('document-tracking.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Document" />

            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                <div className="align-self-center m-4 mx-auto w-full justify-self-center rounded-xl border p-4 md:mx-auto md:my-6 md:w-7/9">
                    
                    {/* Header */}
                    <div className="relative mb-4 flex items-center">
                        <Link
                            onClick={() => window.history.back()}
                            className="z-10 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <h2 className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
                            <Plus className="h-7 w-7 text-primary" />
                            NEW DCN
                        </h2>
                    </div>

                    <Separator className="m-4" />

                    <TrackingTitleForm
                        data={data}
                        setData={setData}
                        uploadToken={uploadToken.current}
                        documentTypes={documentTypes}
                        trackingClassification={trackingClassification}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}