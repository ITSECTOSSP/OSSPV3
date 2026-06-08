import CouncilorForm from '@/components/admin/legislative-tracking/city-councilors/forms/councilor-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    LegislativeCityCouncil,
    LegislativeDistrict,
} from '@/types/legislative-tracking';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

import { Separator } from '@/components/ui/separator';
import { ArrowLeft, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: route('admin-panel.dashboard'),
    },
    {
        title: 'City Councilors',
        href: route('admin-panel.city-councilors.index'),
    },
    {
        title: 'Create City Councilor',
        href: '#',
    },
];

type Props = {
    districts: LegislativeDistrict[];
    cityCouncils: LegislativeCityCouncil[];
};

export default function Create({ districts, cityCouncils }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create City Councilor" />

            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                <div className="mx-auto my-6 w-full rounded-xl border p-4 md:w-7/9">
                    {/* HEADER (same style as DCN page) */}
                    <div className="relative mb-4 flex items-center">
                        <Link
                            onClick={() => window.history.back()}
                            className="z-10 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <h2 className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
                            <UserPlus className="h-7 w-7 text-primary" />
                            NEW CITY COUNCILOR
                        </h2>
                    </div>

                    <Separator className="m-4" />

                    {/* FORM */}
                    <CouncilorForm
                        districts={districts}
                        cityCouncils={cityCouncils}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
