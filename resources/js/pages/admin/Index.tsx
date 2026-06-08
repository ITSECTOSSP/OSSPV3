import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Paginated, User, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { route } from 'ziggy-js';
import { UsersTable } from './user-management/Index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: route('admin-panel.dashboard'),
    },
];

type Props = {
    users: Paginated<User>;
};

export default function Dashboard({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* DOCUMENT TRACKING */}
                <div className="w-full rounded-2xl border border-sidebar-border/70 bg-background shadow-sm dark:border-sidebar-border">
                    {/* Header */}
                    <div className="border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Document Tracking
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Manage document types, classifications, and
                                categories.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-wrap gap-4 p-6">
                        <Link href={route('admin-panel.document-types.index')}>
                            <Button className="min-w-[220px] justify-start gap-2">
                                <Plus className="h-4 w-4" />
                                Document Type
                            </Button>
                        </Link>
                        <Link href={route('admin-panel.document-classifications.index')}>
                            <Button className="min-w-[220px] justify-start gap-2">
                                <Plus className="h-4 w-4" />
                                Document Classification
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* LEGISLATIVE TRACKING */}
                <div className="w-full rounded-2xl border border-sidebar-border/70 bg-background shadow-sm dark:border-sidebar-border">
                    {/* Header */}
                    <div className="border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Legislative Tracking
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Manage document types, City Council, Councilors,
                                and other related information.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-wrap gap-4 p-6">
                        <Link
                            href={route(
                                'admin-panel.city-councils.index',
                            )}
                        >
                            <Button className="min-w-[260px] justify-start gap-2">
                                <Plus className="h-4 w-4" />
                                City Council
                            </Button>
                        </Link>

                        <Link href={route('admin-panel.city-councilors.index')}>
                            <Button className="min-w-[220px] justify-start gap-2">
                                <Plus className="h-4 w-4" />
                                City Councilor
                            </Button>
                        </Link>
                    </div>
                </div>
                {/*USER MANAGEMENT*/}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {/* Header */}
                    <div className="border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Employee Users Management
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                List of Employee Users, their roles, and other
                                related information.
                            </p>
                        </div>
                    </div>
                    <UsersTable users={users} />
                </div>
            </div>
        </AppLayout>
    );
}
