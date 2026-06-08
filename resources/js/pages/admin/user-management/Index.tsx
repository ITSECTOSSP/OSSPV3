import { DataTable } from '@/components/admin/user-management/ossp-datatable';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Paginated, User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

type Props = {
    users: Paginated<User>;
};

export function UsersTable({ users }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<User | null>(null);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = (item: User) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        setProcessing(true);

        router.delete(route('admin-panel.users.destroy', selectedItem.id), {
            onFinish: () => {
                setProcessing(false);
                setOpenDialog(false);
            },
        });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4">
                <Link href={route('admin-panel.users.create')}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New User
                    </Button>
                </Link>
            </div>

            <DataTable
                data={users.data}
                onDelete={confirmDelete}
                perPage={users.per_page}
                onPerPageChange={() => {}}
            />

            {/* Pagination Links */}
            <div className="mt-4 flex justify-center gap-2">
                {users.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url ?? '#'}
                        preserveScroll
                        preserveState
                        className={`rounded px-3 py-1 text-sm ${
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'border'
                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{selectedItem?.full_name}</strong>? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={processing}
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
