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
import { User } from '@/types';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Check, Settings, Grid2x2Plus } from 'lucide-react';
import { useState } from 'react';
import { getColumns } from './ossp-columns';

type DataTableProps = {
    data: User[];
    onDelete: (item: User) => void;
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
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        employee_number: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        role: true,
        section: true,
        created_at: false,
        actions: true,
    });

    const filteredColumns = getColumns(onDelete).filter(
        (col) => visibleColumns[col.id!],
    );

    const table = useReactTable({
        data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border m-2 p-2">
            {/* Top controls */}
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
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={filteredColumns.length}>
                                No records found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
