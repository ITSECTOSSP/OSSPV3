import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LegislativeCityCouncilor } from '@/types/legislative-tracking';
import { Link } from '@inertiajs/react';
import { CellContext } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';

    const d = new Date(dateString);

    return d.toLocaleString();
};

export const getColumns = (
    onDelete: (item: LegislativeCityCouncilor) => void,
    expandedCouncils: Record<number, boolean>,
    setExpandedCouncils: React.Dispatch<
        React.SetStateAction<Record<number, boolean>>
    >,
    isMobile = false,
) => {
    return [

        {
            id: 'councilor_name',
            accessorKey: 'councilor_name',
            header: 'COUNCILOR NAME',
            size: 250,
            minSize: 200,

            cell: (ctx: CellContext<LegislativeCityCouncilor, unknown>) => (
                <div className="font-medium break-words whitespace-normal">
                    {ctx.row.original.councilor_name}
                </div>
            ),
        },

        {
            id: 'district',
            header: 'DISTRICT',

            accessorFn: (row: LegislativeCityCouncilor) =>
                row.district?.district_name ?? '',

            size: 180,

            cell: (ctx: CellContext<LegislativeCityCouncilor, unknown>) => {
                const district = ctx.row.original.district;

                if (!district) return '-';

                return (
                    <Badge variant="outline">{district.district_name}</Badge>
                );
            },
        },

        {
            id: 'city_councils',
            header: 'CITY COUNCILS',

            accessorFn: (row: LegislativeCityCouncilor) =>
                row.city_councils?.map((c) => c.council_name).join(', ') ?? '',

            cell: (ctx: CellContext<LegislativeCityCouncilor, unknown>) => {
                const item = ctx.row.original;

                const items = item.city_councils ?? [];
                const rowId = item.id;

                const expanded = expandedCouncils[rowId] ?? false;

                if (!items.length) return '-';

                const visible = expanded ? items : items.slice(0, 3);
                const remaining = items.length - visible.length;
                

                return (
                    <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                            {visible.map((council) => (
                                <Badge
                                    key={council.id}
                                    variant="secondary"
                                    className="text-xs whitespace-nowrap"
                                    title={council.council_name}
                                >
                                    {council.council_name}
                                </Badge>
                            ))}

                            {!expanded && remaining > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedCouncils((prev) => ({
                                            ...prev,
                                            [rowId]: true,
                                        }))
                                    }
                                    className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted/80"
                                >
                                    +{remaining} more
                                </button>
                            )}
                        </div>

                        {expanded && items.length > 3 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedCouncils((prev) => ({
                                        ...prev,
                                        [rowId]: false,
                                    }))
                                }
                                className="text-[11px] text-muted-foreground hover:underline"
                            >
                                Show less
                            </button>
                        )}
                    </div>
                );
            },
        },

        ...(!isMobile
            ? [
                  {
                      id: 'contact',
                      accessorKey: 'contact',
                      header: 'CONTACT',
                      size: 180,

                      cell: (
                          ctx: CellContext<LegislativeCityCouncilor, unknown>,
                      ) => ctx.row.original.contact ?? '-',
                  },

                  {
                      id: 'details',
                      accessorKey: 'details',
                      header: 'DETAILS',
                      size: 250,

                      cell: (
                          ctx: CellContext<LegislativeCityCouncilor, unknown>,
                      ) => (
                          <div className="break-words whitespace-normal">
                              {ctx.row.original.details ?? '-'}
                          </div>
                      ),
                  },
                  {
                      id: 'created_at',
                      header: 'DATE CREATED',

                      accessorFn: (row: LegislativeCityCouncilor) =>
                          row.created_at ?? '',

                      size: 180,

                      cell: (
                          ctx: CellContext<LegislativeCityCouncilor, unknown>,
                      ) => formatDateTime(ctx.row.original.created_at),
                  },
              ]
            : []),

        {
            id: 'actions',
            cell: (ctx: CellContext<LegislativeCityCouncilor, unknown>) => {
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
                                        'admin-panel.city-councilors.edit',
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
