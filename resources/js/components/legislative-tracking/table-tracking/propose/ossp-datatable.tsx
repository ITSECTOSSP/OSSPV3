import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LegislativeProposed } from '@/types/legislative-tracking';
import {
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Check, Grid2x2Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { getColumns } from './ossp-columns';

type DataTableProps = {
    data: LegislativeProposed[];
    onDelete: (item: LegislativeProposed) => void;
    perPage: number;
    onPerPageChange: (value: number) => void;
    perPageOptions?: number[];
};

export function DataTable({
    data,
    onDelete,
    perPage,
    onPerPageChange,
    perPageOptions = [10, 25, 50, 100],
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [expandedTitles, setExpandedTitles] = useState<
        Record<string, boolean>
    >({});

    const [visibleColumns, setVisibleColumns] = useState<
        Record<string, boolean>
    >({
        propose_no: true,
        propose_title: true,
        measure_type: true,
        city_council: true,
        proponents: true,
        actions: true,
        created_at: true,
        created_by: false,
        updated_at: false,
        updated_by: false,
    });

    // Now this works because onDelete is correctly typed for TrackingTitle
    const filteredColumns = getColumns(
        onDelete,
        expandedTitles,
        setExpandedTitles,
    ).filter((col) => visibleColumns[col.id!]);

    const table = useReactTable({
        data,
        columns: filteredColumns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
    });

    return (
        <div className="m-2 rounded-md border p-2">
            {/* Top controls: columns toggle + per-page */}
            <div className="flex flex-wrap items-center justify-end gap-4">
                {/* Columns toggle dropdown */}
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Grid2x2Plus /> Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {Object.keys(visibleColumns).map((key) => (
                                <DropdownMenuItem
                                    key={key}
                                    className="flex cursor-pointer items-center justify-between"
                                    onClick={() =>
                                        setVisibleColumns((prev) => ({
                                            ...prev,
                                            [key]: !prev[key],
                                        }))
                                    }
                                >
                                    <span className="capitalize">
                                        {key.replace('_', ' ')}
                                    </span>
                                    {visibleColumns[key] && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Per Page selector */}
                <Select
                    value={String(perPage)}
                    onValueChange={(value) => onPerPageChange(Number(value))}
                >
                    <SelectTrigger className="w-40 gap-2">
                        <Settings />
                        <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Items per page</SelectLabel>
                            {perPageOptions.map((opt) => (
                                <SelectItem key={opt} value={String(opt)}>
                                    {opt} / page
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        className="relative overflow-hidden whitespace-nowrap"
                                    >
                                        <div
                                            className="flex cursor-pointer items-center gap-1 select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}

                                            {{
                                                asc: ' ↑',
                                                desc: ' ↓',
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </div>

                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={`absolute top-0 right-0 h-full w-1 cursor-col-resize select-none ${
                                                    header.column.getIsResizing()
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-300'
                                                }`}
                                            />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        style={{ width: cell.column.getSize() }}
                                        className="overflow-hidden align-top"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
