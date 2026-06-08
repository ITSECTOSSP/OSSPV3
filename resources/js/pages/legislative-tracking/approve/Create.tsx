import LegislativeApproveForm from '@/components/legislative-tracking/form/ossp-legislative-approve-form';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    LegislativeCityCouncil,
    LegislativeMeasureType,
} from '@/types/legislative-tracking';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Legislative Data Tracking',
        href: route('legislative-tracking.approve.create'),
    },
    {
        title: 'New Approve',
        href: '#',
    },
];

type CreateProps = {
    measureTypes: LegislativeMeasureType[];
    citycouncils: LegislativeCityCouncil[];
    defaultCityCouncilId: number | null;
};

export default function Index({
    measureTypes,
    citycouncils,
    defaultCityCouncilId,
}: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        approve_no: '',
        approve_title: '',
        measure_type_id: '',
        enact_adopt_date: '',
        series_year: '',
        city_council_id: defaultCityCouncilId
            ? String(defaultCityCouncilId)
            : '',
        // ✅ ADD THESE TWO
        introducer_ids: [] as string[],
        co_introducer_ids: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('legislative-tracking.approve.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Approved" />

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
                            NEW APPROVED MEASURE
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
                    />
                </div>
            </div>
        </AppLayout>
    );
}
