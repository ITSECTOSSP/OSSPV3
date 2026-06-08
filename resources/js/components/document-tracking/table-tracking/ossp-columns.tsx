import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TrackingTitle } from '@/types/document-tracking';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, MoreHorizontal, Send, SquarePen } from 'lucide-react';
import { route } from 'ziggy-js';

/** DATE FORMAT */
const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '-';

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    let hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    const ampm = hh >= 12 ? 'PM' : 'AM';

    hh = hh % 12;
    hh = hh === 0 ? 12 : hh;

    const hourStr = String(hh).padStart(2, '0');

    return `${mm}/${dd}/${yyyy}, ${hourStr}:${min} ${ampm}`;
};

/** COLOR HELPERS */
const typeColors: Record<number, string> = {
    1: 'bg-amber-100 text-amber-700',
    2: 'bg-lime-100 text-lime-700',
    3: 'bg-purple-100 text-purple-700',
    4: 'bg-orange-100 text-orange-700',
    5: 'bg-teal-100 text-teal-700',
    6: 'bg-emerald-100 text-emerald-700',
    7: 'bg-pink-100 text-pink-700',
};

const classificationColors: Record<number, string> = {
    1: 'bg-cyan-100 text-cyan-700',
    2: 'bg-rose-100 text-rose-700',
    3: 'bg-fuchsia-100 text-fuchsia-700',
};

export const getColumns = (
    onDelete: (item: TrackingTitle) => void,
    isMobile: boolean,
    expandedRows: Record<string, boolean>,
    setExpandedRows: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >,
    expandedText: Record<string, Record<string, boolean>>,
    setExpandedText: React.Dispatch<
        React.SetStateAction<Record<string, Record<string, boolean>>>
    >,
): ColumnDef<TrackingTitle>[] => {
    const toggleCell = (rowId: string, key: string) => {
        setExpandedText((prev) => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [key]: !prev[rowId]?.[key],
            },
        }));
    };

    return [
        {
            id: 'dcn',
            accessorKey: 'titles_dcn',
            header: 'DCN',
            size: 100,
            minSize: 90,
        },
        /**TITLE */
        {
            id: 'title',
            accessorKey: 'titles_title',
            header: 'TITLE',
            size: isMobile ? 240 : 400,
            minSize: 200,
            cell: (ctx) => {
                const row = ctx.row.original;
                const rowId = String(row.id);

                const expanded = expandedText[rowId]?.title ?? false;

                return (
                    <div
                        onClick={() =>
                            setExpandedText((prev) => ({
                                ...prev,
                                [rowId]: {
                                    ...prev[rowId],
                                    title: !prev[rowId]?.title,
                                },
                            }))
                        }
                        className="cursor-pointer space-y-1"
                    >
                        <div
                            className={`font-medium break-words whitespace-normal ${
                                expanded
                                    ? ''
                                    : isMobile
                                      ? 'line-clamp-3'
                                      : 'line-clamp-2'
                            }`}
                        >
                            {row.titles_title}
                        </div>
                    </div>
                );
            },
        },
        /**FROM */
        {
            id: 'from',
            accessorKey: 'titles_from',
            header: 'FROM',
            size: 180,
            minSize: 150,
            cell: (ctx) => {
                const row = ctx.row.original;
                const rowId = String(row.id);

                const expanded = expandedText[rowId]?.from ?? false;
                const text = row.titles_from || '-';

                return (
                    <div
                        onClick={() =>
                            setExpandedText((prev) => ({
                                ...prev,
                                [rowId]: {
                                    ...prev[rowId],
                                    from: !prev[rowId]?.from,
                                },
                            }))
                        }
                        className="cursor-pointer space-y-1"
                    >
                        <div
                            className={`text-sm break-words whitespace-normal text-gray-700 ${
                                expanded ? '' : 'line-clamp-2'
                            }`}
                        >
                            {text}
                        </div>
                    </div>
                );
            },
        },
        /** SUBJECT */
        {
            id: 'subject',
            accessorKey: 'titles_subject',
            header: 'SUBJECT',
            size: 250,
            minSize: 200,
            cell: (ctx) => {
                const row = ctx.row.original;
                const rowId = String(row.id);

                const expanded = expandedText[rowId]?.subject ?? false;
                const text = row.titles_subject || '-';

                return (
                    <div
                        onClick={() =>
                            setExpandedText((prev) => ({
                                ...prev,
                                [rowId]: {
                                    ...prev[rowId],
                                    subject: !prev[rowId]?.subject,
                                },
                            }))
                        }
                        className="cursor-pointer space-y-1"
                    >
                        <div
                            className={`text-sm break-words whitespace-normal text-gray-700 ${
                                expanded ? '' : 'line-clamp-2'
                            }`}
                        >
                            {text}
                        </div>
                    </div>
                );
            },
        },
        /** TYPE (PILL) */
        {
            id: 'type',
            header: 'TYPE',
            accessorFn: (row) => row.document_type?.types_name ?? '',
            cell: (ctx) => {
                const type = ctx.row.original.document_type;

                if (!type) return '-';

                return (
                    <Badge
                        className={
                            typeColors[Number(type.id)] ??
                            'bg-gray-100 text-gray-700'
                        }
                    >
                        {type.types_name}
                    </Badge>
                );
            },
        },

        /** CLASSIFICATION (PILL) */
        {
            id: 'classification',
            header: 'CLASSIFICATION',
            accessorFn: (row) =>
                row.document_classifications?.classifications_name ?? '',
            cell: (ctx) => {
                const c = ctx.row.original.document_classifications;

                if (!c) return '-';

                return (
                    <Badge
                        className={
                            classificationColors[Number(c.id)] ??
                            'bg-gray-100 text-gray-700'
                        }
                    >
                        {c.classifications_name}
                    </Badge>
                );
            },
        },

        /** ASSIGNED */
        {
            id: 'assigned_sections',
            header: 'ASSIGNED',

            accessorFn: (row) =>
                row.assignments
                    ?.map((a) => a.section?.sections_name)
                    .join(', ') ?? '',

            cell: (ctx) => {
                const row = ctx.row.original;
                const assignments = row.assignments ?? [];
                const rowId = String(row.id);

                const expanded = expandedRows[rowId] ?? false;

                if (!assignments.length) {
                    return (
                        <span className="text-xs text-gray-400">
                            Unassigned
                        </span>
                    );
                }

                const visible = expanded
                    ? assignments
                    : assignments.slice(0, 3);

                const remaining = assignments.length - visible.length;

                return (
                    <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                            {visible.map((a) => {
                                const name = a.section?.sections_name;
                                if (!name) return null;

                                return (
                                    <Badge
                                        key={a.id}
                                        variant="secondary"
                                        className="inline-flex w-fit px-2 py-0.5 text-xs whitespace-nowrap"
                                        title={name}
                                    >
                                        {name}
                                    </Badge>
                                );
                            })}

                            {!expanded && remaining > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedRows((prev) => ({
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

                        {expanded && assignments.length > 3 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedRows((prev) => ({
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
        /** CREATED */
        {
            id: 'created_at',
            header: 'DATE CREATED',
            accessorFn: (row) => row.created_at,
            cell: (ctx) => formatDateTime(ctx.row.original.created_at),
        },

        {
            id: 'created_by',
            header: 'CREATED BY',
            accessorFn: (row) => row.creator?.full_name ?? '-',
        },

        /** UPDATED */
        {
            id: 'updated_at',
            header: 'DATE MODIFIED',
            accessorFn: (row) => row.updated_at,
            cell: (ctx) => formatDateTime(ctx.row.original.updated_at),
        },

        {
            id: 'updated_by',
            header: 'MODIFIED BY',
            accessorFn: (row) => row.editor?.full_name ?? '-',
        },

        /** ACTIONS */
        {
            id: 'actions',
            size: 50,
            minSize: 50,
            cell: (ctx) => {
                const item = ctx.row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {/* NOTIFY */}
                            {item.notify_depthead ? (
                                <DropdownMenuItem
                                    disabled
                                    className="flex items-center gap-2 opacity-70"
                                >
                                    <Send className="h-4 w-4 text-green-600" />
                                    Department Head Notified
                                </DropdownMenuItem>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="flex items-center gap-2"
                                        >
                                            <Send className="h-4 w-4" />
                                            Notify Dept. Head
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Notify Department Head?
                                            </AlertDialogTitle>

                                            <AlertDialogDescription>
                                                Send notification for DCN{' '}
                                                <strong>
                                                    {item.titles_dcn}
                                                </strong>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={() =>
                                                    router.post(
                                                        route(
                                                            'document-tracking.notify',
                                                            item.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Notify
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <DropdownMenuSeparator />

                            {/* MANAGE */}
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        'document-tracking.manage',
                                        item.id,
                                    )}
                                    className="flex items-center gap-2"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Manage DCN
                                </Link>
                            </DropdownMenuItem>

                            {/* EDIT */}
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        'document-tracking.edit',
                                        item.id,
                                    )}
                                    className="flex items-center gap-2"
                                >
                                    <SquarePen className="h-4 w-4" />
                                    Edit DCN
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* DELETE */}
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onDelete(item)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};
