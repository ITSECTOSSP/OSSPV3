import TrackingTitleForm from '@/components/document-tracking/forms/ossp-tracking-form';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    DocumentType,
    TrackingClassification,
    TrackingFile,
} from '@/types/document-tracking';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit as EditIcon } from 'lucide-react';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { route } from 'ziggy-js';

const breadcrumbs = (titles_dcn: string): BreadcrumbItem[] => [
    {
        title: 'Document Tracking',
        href: route('document-tracking.index'),
    },
    {
        title: `Edit DCN ${titles_dcn}`,
        href: '#',
    },
];

type EditProps = {
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
    item: {
        id: number;
        titles_dcn: string;
        titles_from: string;
        titles_subject: string;
        titles_title: string;
        document_type_id: string;
        classifications_id: string;
        upload_token: string;
    };
    files: TrackingFile[];
};

export default function Edit({
    documentTypes,
    trackingClassification,
    item,
    files,
}: EditProps) {
    if (!item) return <div>Loading...</div>;

    const uploadToken = useRef(item.upload_token ?? uuidv4());

    const { data, setData, put, processing, errors } = useForm({
        titles_dcn: item.titles_dcn || '',
        titles_from: item.titles_from || '',
        titles_subject: item.titles_subject || '',
        titles_title: item.titles_title || '',
        document_type_id: item.document_type_id || '',
        classifications_id: item.classifications_id || '',
        upload_token: uploadToken.current,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('document-tracking.update', item.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(item.titles_dcn)}>
            <Head title={`Edit Document ${item.titles_dcn}`} />

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
                            <EditIcon className="h-7 w-7 text-primary" />
                            EDIT DCN
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
                        item={item}
                        files={files}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
