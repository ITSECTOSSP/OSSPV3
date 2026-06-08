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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LegislativeApproved } from '@/types/legislative-tracking';
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
    data: LegislativeApproved[];
    onDelete: (item: LegislativeApproved) => void;
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

    const isMobile = useMediaQuery('(max-width: 768px)');

    const [visibleColumns, setVisibleColumns] = useState<
        Record<string, boolean>
    >({
        approve_no: true,
        approve_title: true,
        enact_adopt_date: true,
        measure_type: true,
        city_council_id: true,
        introducers: true,
        co_introducers: false,
        series_year: true,
        actions: true,
        created_at: true,
        created_by: false,
        updated_at: false,
        updated_by: false,
    });

    const mobileVisibleColumns: Record<string, boolean> = {
        approve_no: true,
        approve_title: true,
        enact_adopt_date: false,
        measure_type: true,
        city_council_id: true,
        introducers: false,
        co_introducers: false,
        series_year: false,
        created_at: false,
        created_by: false,
        updated_at: false,
        updated_by: false,
        actions: true,
    };

    const activeVisibleColumns = isMobile
        ? mobileVisibleColumns
        : visibleColumns;

    const allColumns = getColumns(
        onDelete,
        isMobile,
        expandedTitles,
        setExpandedTitles,
    );

    const filteredColumns = allColumns.filter(
        (col) => col.id && activeVisibleColumns[col.id],
    );

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
            {/* Top controls */}
            <div className="flex flex-wrap items-center justify-end gap-4">
                {/* Column toggle ONLY on desktop */}
                {!isMobile && (
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
                                        {key.replaceAll('_', ' ')}
                                    </span>

                                    {visibleColumns[key] && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Per page */}
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
                                                className={`absolute top-0 right-0 h-full w-1 cursor-col-resize ${
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
