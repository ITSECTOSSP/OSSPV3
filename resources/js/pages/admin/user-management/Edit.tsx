import UserForm from '@/components/admin/user-management/forms/user-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OsspSections, UserRole, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { route } from 'ziggy-js';

interface Props {
    roles: UserRole[];
    sections: OsspSections[];
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users Management', href: route('admin-panel.users.index') },
    { title: 'Edit User', href: route('admin-panel.users.index') },
];

export default function EditUser({ roles, sections, user }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="align-self-center m-4 mx-auto w-7/9 justify-self-center rounded-lg border p-4">
                <Link
                    href={route('admin-panel.users.index')}
                    className="mb-4 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                <UserForm
                    roles={roles}
                    sections={sections}
                    user={user}
                    url={route('admin-panel.users.update', user.id)}
                    method="put"
                />
            </div>
        </AppLayout>
    );
}