import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TrackingCategory } from '@/types/document-tracking';
import { Link } from '@inertiajs/react';
import { CellContext } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
};

export const getColumns = (
    onDelete: (item: TrackingCategory) => void,
    isMobile = false,
) => {
    return [
        {
            id: 'categories_name',
            accessorKey: 'categories_name',
            header: 'DOCUMENT CATEGORY',
            size: 400,

            cell: (ctx: CellContext<TrackingCategory, unknown>) => (
                <div className="font-medium break-words whitespace-normal">
                    {ctx.row.original.categories_name}
                </div>
            ),
        },

        ...(!isMobile
            ? [
                  {
                      id: 'created_at',
                      header: 'DATE CREATED',
                      accessorFn: (row: TrackingCategory) =>
                          row.created_at ?? '',
                      size: 200,

                      cell: (
                          ctx: CellContext<TrackingCategory, unknown>,
                      ) => formatDateTime(ctx.row.original.created_at),
                  },
              ]
            : []),

        {
            id: 'actions',
            size: 80,

            cell: (ctx: CellContext<TrackingCategory, unknown>) => {
                const item = ctx.row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        'admin-panel.document-categories.edit',
                                        item.id,
                                    )}
                                    className="flex items-center gap-2"
                                >
                                    <SquarePen className="h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onDelete(item)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};