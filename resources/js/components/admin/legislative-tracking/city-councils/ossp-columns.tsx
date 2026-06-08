import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LegislativeCityCouncil } from '@/types/legislative-tracking';
import { Link } from '@inertiajs/react';
import { CellContext } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';

    return new Date(dateString).toLocaleString();
};

export const getColumns = (
    onDelete: (item: LegislativeCityCouncil) => void,
    isMobile = false,
) => {
    return [
        {
            id: 'council_name',
            accessorKey: 'council_name',
            header: 'CITY COUNCIL',
            size: 350,

            cell: (ctx: CellContext<LegislativeCityCouncil, unknown>) => (
                <div className="font-medium break-words whitespace-normal">
                    {ctx.row.original.council_name}
                </div>
            ),
        },

        ...(!isMobile
            ? [
                  {
                      id: 'created_at',
                      header: 'DATE CREATED',

                      accessorFn: (row: LegislativeCityCouncil) =>
                          row.created_at ?? '',

                      size: 200,

                      cell: (
                          ctx: CellContext<
                              LegislativeCityCouncil,
                              unknown
                          >,
                      ) => formatDateTime(ctx.row.original.created_at),
                  },
              ]
            : []),

        {
            id: 'actions',

            size: 80,

            cell: (ctx: CellContext<LegislativeCityCouncil, unknown>) => {
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
                                        'admin-panel.city-councils.edit',
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