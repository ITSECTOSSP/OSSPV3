import LegislativeProposeForm from '@/components/legislative-tracking/form/ossp-legislative-propose-form';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit as EditIcon } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs = (propose_no: string): BreadcrumbItem[] => [
    {
        title: 'Legislative Tracking',
        href: route('legislative-tracking.propose.index'),
    },
    {
        title: `Edit ${propose_no}`,
        href: '#',
    },
];

type MeasureType = {
    id: number;
    measure_name: string;
};

type EditProps = {
    measureTypes: MeasureType[];
    citycouncils: any[];
    item: {
        id: number;
        propose_no: string;
        propose_title: string;
        measure_type_id: string | number;
        city_council_id?: string | number;
    };
    proponent_ids: string[];
};

export default function Edit({ measureTypes, citycouncils, item, proponent_ids }: EditProps) {
    if (!item) return <div>Loading...</div>;

    const { data, setData, put, processing, errors } = useForm({
        propose_no: item.propose_no || '',
        propose_title: item.propose_title || '',
        measure_type_id: String(item.measure_type_id || ''), 
        city_council_id: item.city_council_id ? String(item.city_council_id) : '',
        proponent_ids: proponent_ids || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('legislative-tracking.propose.update', item.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(item.propose_no)}>
            <Head title={`Edit ${item.propose_no}`} />

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
                            EDIT PROPOSAL
                        </h2>
                    </div>

                    <Separator className="m-4" />

                    <LegislativeProposeForm
                        data={data}
                        setData={setData}
                        measureTypes={measureTypes}
                        citycouncils={citycouncils}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                        mode="edit" // ✅ reuse form properly
                    />
                </div>
            </div>
        </AppLayout>
    );
}