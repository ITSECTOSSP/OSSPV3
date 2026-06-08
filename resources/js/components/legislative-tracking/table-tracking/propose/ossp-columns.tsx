import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LegislativeProposed } from '@/types/legislative-tracking';
import { getPillColor } from '@/utils/pills';
import { Link } from '@inertiajs/react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

// Helper to format date as MM/DD/YYYY - HH:MM
const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    let hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12;
    hh = hh === 0 ? 12 : hh; // convert 0 to 12 for midnight
    const hourStr = String(hh).padStart(2, '0');

    return `${mm}/${dd}/${yyyy}, ${hourStr}:${min} ${ampm}`;
};

export const getColumns = (
    onDelete: (item: LegislativeProposed) => void,
    expandedTitles: Record<string, boolean>,
    setExpandedTitles: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >,
): ColumnDef<LegislativeProposed>[] => [
    {
        id: 'propose_no',
        accessorKey: 'propose_no',
        header: 'PROPOSED NO.',
        accessorFn: (row) => row.propose_no,
        size: 90,
        minSize: 80,
    },
    {
        id: 'propose_title',
        accessorKey: 'propose_title',
        header: 'PROPOSED TITLE',
        size: 400,
        minSize: 250,
        maxSize: 1200,

        cell: (ctx) => {
            const row = ctx.row.original;
            const rowId = String(row.id);

            const expanded = expandedTitles[rowId] ?? false;

            return (
                <button
                    type="button"
                    onClick={() =>
                        setExpandedTitles((prev) => ({
                            ...prev,
                            [rowId]: !prev[rowId],
                        }))
                    }
                    className="w-full text-left"
                >
                    <div
                        className={`leading-snug font-medium break-words whitespace-normal transition-all ${
                            expanded ? '' : 'line-clamp-2'
                        }`}
                        title={row.propose_title}
                    >
                        {row.propose_title}
                    </div>
                </button>
            );
        },
    },
    {
        id: 'measure_type',
        header: 'MEASURE TYPE',
        accessorFn: (row) => row.measureType?.measure_name ?? '',
        size: 120,
        minSize: 100,
        cell: (ctx: CellContext<LegislativeProposed, any>) => {
            const type = ctx.row.original.measureType;

            if (!type) return '-';

            const typeId = Number(type.id);
            const typeName = type.measure_name;

            const colors: Record<number, string> = {
                1: 'bg-rose-100 text-rose-700',
                2: 'bg-cyan-100 text-cyan-700',
            };

            return (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                        colors[typeId] ?? 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {typeName}
                </span>
            );
        },
    },
    {
        id: 'city_council',
        header: 'CITY COUNCIL',
        accessorFn: (row) => row.citycouncil?.council_name ?? '',
        size: 120,
        minSize: 100,
        cell: (ctx: CellContext<LegislativeProposed, any>) => {
            const type = ctx.row.original.citycouncil;

            if (!type) return '-';

            const typeId = Number(type.id);
            const typeName = type.council_name;

            const colors: Record<number, string> = {
                1: 'bg-rose-100 text-rose-700',
                2: 'bg-cyan-100 text-cyan-700',
            };

            return (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                        colors[typeId] ?? 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {typeName}
                </span>
            );
        },
    },
    {
        id: 'proponents',
        header: 'PROPONENTS',
        accessorFn: (row) => row.proponents,

        cell: (ctx: CellContext<LegislativeProposed, unknown>) => {
            const items = ctx.row.original.proponents ?? [];

            const [expanded, setExpanded] = useState(false);

            if (!items.length) return '-';

            const visible = expanded ? items : items.slice(0, 3);
            const remaining = items.length - visible.length;

            return (
                <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                        {visible.map((i) => (
                            <span
                                key={i.id}
                                title={i.councilor_name}
                                className={`inline-flex max-w-[180px] items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${getPillColor(
                                    i.id,
                                )}`}
                            >
                                <span className="truncate">
                                    {i.councilor_name}
                                </span>
                            </span>
                        ))}

                        {!expanded && remaining > 0 && (
                            <button
                                type="button"
                                onClick={() => setExpanded(true)}
                                className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted/80"
                            >
                                +{remaining} more
                            </button>
                        )}
                    </div>

                    {expanded && items.length > 3 && (
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="text-[11px] text-muted-foreground hover:underline"
                        >
                            Show less
                        </button>
                    )}
                </div>
            );
        },
    },
    {
        id: 'created_at',
        header: 'DATE CREATED',
        accessorFn: (row) => row.created_at,
        size: 200,
        minSize: 180,
        cell: (ctx) => formatDateTime(ctx.row.original.created_at),
    },
    {
        id: 'created_by',
        header: 'CREATED BY',
        accessorFn: (row) => row.creator?.full_name ?? '-',
        size: 200,
        minSize: 180,
        cell: (ctx: CellContext<LegislativeProposed, any>) =>
            ctx.row.original.creator?.full_name || '-',
    },
    {
        id: 'updated_at',
        header: 'DATE MODIFIED',
        accessorFn: (row) => row.updated_at,
        size: 200,
        minSize: 180,
        cell: (ctx) => formatDateTime(ctx.row.original.updated_at),
    },
    {
        id: 'updated_by',
        header: 'MODIFIED BY',
        accessorFn: (row) => row.editor?.full_name ?? '-',
        size: 200,
        minSize: 180,
        cell: (ctx: CellContext<LegislativeProposed, any>) =>
            ctx.row.original.editor?.full_name || '-',
    },
    {
        id: 'actions',
        size: 50,
        minSize: 50,
        cell: (ctx: CellContext<LegislativeProposed, any>) => {
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
                                    'legislative-tracking.propose.edit',
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
                            className="text-red-600 focus:text-red-600"
                            onClick={() => onDelete(item)}
                        >
                            <Trash2 className="mr-2 h-4 w-4 text-red-600 focus:text-red-600" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
