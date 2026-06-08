import LegislativeApproveForm from '@/components/legislative-tracking/form/ossp-legislative-approve-form';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    LegislativeApproved,
    LegislativeCityCouncil,
    LegislativeMeasureType,
} from '@/types/legislative-tracking';

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { route } from 'ziggy-js';

type EditProps = {
    item: LegislativeApproved;
    measureTypes: LegislativeMeasureType[];
    citycouncils: LegislativeCityCouncil[];

    introducer_ids: string[];
    co_introducer_ids: string[];
};

export default function Edit({
    item,
    measureTypes,
    citycouncils,
    introducer_ids,
    co_introducer_ids,
}: EditProps) {
    const breadcrumbs = (approve_no: string): BreadcrumbItem[] => [
        {
            title: 'Legislative Data Tracking',
            href: route('legislative-tracking.approve.index'),
        },
        {
            title: `Edit ${approve_no}`,
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        approve_no: item.approve_no ?? '',
        approve_title: item.approve_title ?? '',
        measure_type_id: String(item.measure_type_id ?? ''),
        enact_adopt_date: item.enact_adopt_date ?? '',
        series_year: String(item.series_year ?? ''),
        city_council_id: String(item.city_council_id ?? ''),

        introducer_ids: introducer_ids ?? [],
        co_introducer_ids: co_introducer_ids ?? [],
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('legislative-tracking.approve.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(item.approve_no)}>
            <Head title="EDIT APPROVED" />

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
                            <Pencil className="h-7 w-7 text-primary" />
                            EDIT APPROVED MEASURE
                        </h2>
                    </div>

                    <Separator className="m-4" />

                    <LegislativeApproveForm
                        data={data}
                        setData={setData}
                        measureTypes={measureTypes}
                        citycouncils={citycouncils}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                        mode="edit"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
