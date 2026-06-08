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
import { TrackingTitle } from '@/types/document-tracking';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Check, Grid2x2Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { getColumns } from './ossp-columns';

type DataTableProps = {
    data: TrackingTitle[];
    onDelete: (item: TrackingTitle) => void;
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

    const isMobile = useMediaQuery('(max-width: 768px)');

    const [expandedText, setExpandedText] = useState<
        Record<string, Record<string, boolean>>
    >({});

    const [visibleColumns, setVisibleColumns] = useState<
        Record<string, boolean>
    >({
        dcn: true,
        title: true,
        type: true,
        from: true,
        subject: false,
        classification: true,
        assigned_sections: true,
        created_at: true,
        created_by: false,
        updated_at: false,
        updated_by: false,
        actions: true,
    });

    const mobileVisibleColumns: Record<string, boolean> = {
        dcn: true,
        title: true,
        type: true,
        from: true,
        subject: false,
        classification: false,
        assigned_sections: true,
        created_at: false,
        created_by: false,
        updated_at: false,
        updated_by: false,
        actions: true,
    };

    const activeVisibleColumns = isMobile
        ? mobileVisibleColumns
        : visibleColumns;

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
        {},
    );

    const allColumns = getColumns(
        onDelete,
        isMobile,
        expandedRows,
        setExpandedRows,
        expandedText,
        setExpandedText,
    );
    
    // ✅ FIX: robust column key resolution
    const filteredColumns = allColumns.filter((col) => {
        const key =
            col.id ?? ('accessorKey' in col ? col.accessorKey : undefined);

        if (!key) return true;

        return activeVisibleColumns[key] ?? true;
    });

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
