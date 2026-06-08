import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LegislativeApproved } from '@/types/legislative-tracking';
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

//Helper to format date as MM/DD/YYYY for Enact/Adopt Date
const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';

    const d = new Date(dateString);

    if (isNaN(d.getTime())) return '-';

    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
};

//Help column for pills years
const yearColor = (value: string | number) => {
    const colors = [
        'bg-red-100 text-red-700',
        'bg-orange-100 text-orange-700',
        'bg-amber-100 text-amber-700',
        'bg-yellow-100 text-yellow-700',
        'bg-lime-100 text-lime-700',
        'bg-green-100 text-green-700',
        'bg-emerald-100 text-emerald-700',
        'bg-teal-100 text-teal-700',
        'bg-cyan-100 text-cyan-700',
        'bg-sky-100 text-sky-700',
        'bg-blue-100 text-blue-700',
        'bg-indigo-100 text-indigo-700',
        'bg-violet-100 text-violet-700',
        'bg-purple-100 text-purple-700',
        'bg-fuchsia-100 text-fuchsia-700',
        'bg-pink-100 text-pink-700',
        'bg-rose-100 text-rose-700',
    ];

    // simple hash
    let hash = 0;
    const str = String(value);

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;

    return colors[index];
};

// UPDATED COLUMNS
export const getColumns = (
    onDelete: (item: LegislativeApproved) => void,
    isMobile: boolean = false,
    expandedTitles: Record<string, boolean>,
    setExpandedTitles: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >,
): ColumnDef<LegislativeApproved>[] => {
    return [
        {
            id: 'approve_no',
            accessorKey: 'approve_no',
            header: 'NO.',
            size: isMobile ? 90 : 120,
            minSize: 80,
            cell: (ctx: CellContext<LegislativeApproved, unknown>) => (
                <div className="font-medium whitespace-nowrap">
                    {ctx.row.original.approve_no}
                </div>
            ),
        },
        {
            id: 'approve_title',
            accessorKey: 'approve_title',
            header: 'TITLE',
            size: isMobile ? 240 : 400,
            minSize: 220,
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
                                expanded
                                    ? ''
                                    : isMobile
                                      ? 'line-clamp-3 text-sm'
                                      : 'line-clamp-2'
                            }`}
                            title={row.approve_title}
                        >
                            {row.approve_title}
                        </div>
                    </button>
                );
            },
        },
        {
            id: 'measure_type',
            header: 'MEASURE TYPE',
            accessorFn: (row: LegislativeApproved) =>
                row.measureType?.measure_name ?? '',
            size: 120,
            minSize: 100,
            cell: (ctx: CellContext<LegislativeApproved, unknown>) => {
                const type = ctx.row.original.measureType;

                if (!type) return '-';

                const colors: Record<number, string> = {
                    1: 'bg-rose-100 text-rose-700',
                    2: 'bg-cyan-100 text-cyan-700',
                };

                return (
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                            colors[Number(type.id)] ??
                            'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {type.measure_name}
                    </span>
                );
            },
        },
        {
            id: 'city_council_id',
            header: 'CITY COUNCIL',
            accessorFn: (row: LegislativeApproved) =>
                row.citycouncil?.council_name ?? '',
            size: 180,
            minSize: 150,
            cell: (ctx: CellContext<LegislativeApproved, unknown>) => {
                const council = ctx.row.original.citycouncil;

                if (!council) return '-';

                return <Badge variant="outline">{council.council_name}</Badge>;
            },
        },

        // ✅ DESKTOP ONLY COLUMNS
        ...(!isMobile
            ? [
                  {
                      id: 'enact_adopt_date',
                      header: 'ENACT/ADOPT DATE',
                      accessorFn: (row: LegislativeApproved) =>
                          row.enact_adopt_date,
                      size: 200,
                      minSize: 180,
                      cell: (ctx: CellContext<LegislativeApproved, unknown>) =>
                          formatDate(ctx.row.original.enact_adopt_date),
                  },

                  {
                      id: 'series_year',
                      header: 'YEAR',
                      accessorFn: (row: LegislativeApproved) =>
                          row.series_year ?? '-',
                      size: 100,
                      minSize: 80,
                      cell: (
                          ctx: CellContext<LegislativeApproved, unknown>,
                      ) => {
                          const year = ctx.row.original.series_year;

                          if (!year) return '-';

                          return (
                              <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${yearColor(
                                      year,
                                  )}`}
                              >
                                  {year}
                              </span>
                          );
                      },
                  },
                  {
                      id: 'introducers',
                      header: 'INTRODUCERS',
                      accessorFn: (row: LegislativeApproved) => row.introducers,

                      cell: (
                          ctx: CellContext<LegislativeApproved, unknown>,
                      ) => {
                          const items = ctx.row.original.introducers ?? [];

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
                                              className={`inline-flex w-fit max-w-[180px] items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${getPillColor(i.id)}`}
                                          >
                                              <span className="block truncate">
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
                      id: 'co_introducers',
                      header: 'CO-INTRODUCERS',
                      accessorFn: (row: LegislativeApproved) =>
                          row.coIntroducers,

                      cell: (
                          ctx: CellContext<LegislativeApproved, unknown>,
                      ) => {
                          const items = ctx.row.original.coIntroducers ?? [];

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
                                              className={`inline-flex w-fit max-w-[180px] items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${getPillColor(i.id)}`}
                                          >
                                              <span className="block truncate">
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
                      accessorFn: (row: LegislativeApproved) => row.created_at,
                      size: 200,
                      minSize: 180,
                      cell: (ctx: CellContext<LegislativeApproved, unknown>) =>
                          formatDateTime(ctx.row.original.created_at),
                  },
              ]
            : []),

        // ACTIONS (always visible)
        {
            id: 'actions',
            size: 50,
            minSize: 50,
            cell: (ctx: CellContext<LegislativeApproved, unknown>) => {
                const item = ctx.row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        'legislative-tracking.approve.edit',
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
