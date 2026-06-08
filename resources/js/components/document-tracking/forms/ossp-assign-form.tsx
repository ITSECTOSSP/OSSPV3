import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { AssignFormProps, Assignment } from '@/types/document-tracking';
import { router, useForm } from '@inertiajs/react';
import {
    Check,
    ChevronsUpDown,
    MoreHorizontal,
    SquarePen,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import EditAssignDialog from '../ossp-assign-dialog';

interface AssignFormPropsTyped extends AssignFormProps {
    currentUser: User;
}

export default function AssignForm({
    trackingTitleId,
    osspSections = [],
    item,
    currentUser,
}: AssignFormPropsTyped) {
    // ---- FORM STATE ----
    const { data, setData, post, processing, errors, reset } = useForm({
        assigned_remarks: '',
        ossp_sections_ids: [] as string[],
    });

    // ---- ASSIGNMENTS STATE ----
    const [localAssignments, setLocalAssignments] = useState<Assignment[]>(
        item.assignments ?? [],
    );

    // Keep localAssignments in sync with live updates from parent
    useEffect(() => {
        setLocalAssignments(item.assignments ?? []);
    }, [item.assignments]);

    // ---- EDIT & DELETE STATE ----
    const [editingAssignment, setEditingAssignment] =
        useState<Assignment | null>(null);
    const [deleteAssignment, setDeleteAssignment] = useState<Assignment | null>(
        null,
    );

    // Helper to get assigned section IDs
    const assignedSectionIds = localAssignments.map((a) =>
        String(a.section.id),
    );

    // ---- CREATE ASSIGNMENT ----
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('document-tracking.assign.store', trackingTitleId), {
            preserveScroll: true,
            onSuccess: (response) => {
                reset();
                // Add new assignment to local state if returned by backend
                if (response.props?.assignment) {
                    setLocalAssignments((prev) => [
                        ...prev,
                        response.props.assignment as Assignment,
                    ]);
                }
            },
        });
    };

    // AVAILABLE SECTIONS (not yet assigned)
    const availableSections = osspSections.filter(
        (s) => !assignedSectionIds.includes(String(s.id)),
    );

    // CHECK IF ALL AVAILABLE SECTIONS ARE SELECTED
    const isAllSelected =
        availableSections.length > 0 &&
        availableSections.every((s) =>
            data.ossp_sections_ids.includes(String(s.id)),
        );

    // SELECT ALL / DESELECT ALL
    const toggleAllSections = () => {
        if (isAllSelected) {
            // remove only available sections
            setData(
                'ossp_sections_ids',
                data.ossp_sections_ids.filter((id) =>
                    assignedSectionIds.includes(id),
                ),
            );
        } else {
            setData(
                'ossp_sections_ids',
                availableSections.map((s) => String(s.id)),
            );
        }
    };

    const toggleSection = (id: number) => {
        const idStr = String(id);
        if (assignedSectionIds.includes(idStr)) return; // already assigned
        if (data.ossp_sections_ids.includes(idStr)) {
            setData(
                'ossp_sections_ids',
                data.ossp_sections_ids.filter((v) => v !== idStr),
            );
        } else {
            setData('ossp_sections_ids', [...data.ossp_sections_ids, idStr]);
        }
    };

    // ---- DELETE ASSIGNMENT ----
    const confirmRemoveAssignedSection = (assignId: number) => {
        router.delete(route('document-tracking.assign.destroy', assignId), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalAssignments((prev) =>
                    prev.filter((a) => a.id !== assignId),
                );
            },
        });
    };

    const removeAssignedSection = (assignId: number) => {
        confirmRemoveAssignedSection(assignId);
    };

    // ---- GROUP ASSIGNMENTS BY CREATOR ----
    const assignmentsByCreator = localAssignments.reduce(
        (acc, assign) => {
            const creatorName = assign.creator?.name ?? 'Unknown';
            if (!acc[creatorName]) acc[creatorName] = [];
            acc[creatorName].push(assign);
            return acc;
        },
        {} as Record<string, Assignment[]>,
    );

    // ---- STATUS COLORS ----
    const statusColors: Record<number, string> = {
        1: 'bg-orange-100 text-orange-700 border-orange-200',
        2: 'bg-blue-100 text-blue-700 border-blue-200',
        3: 'bg-green-100 text-green-700 border-green-200',
    };

    const [expandedSections, setExpandedSections] = useState(false);

    return (
        <>
            {/* ==== ASSIGN FORM ==== */}
            <form onSubmit={submit} className="space-y-6">
                <FieldGroup>
                    {/* Section Multi-Select */}
                    <Field>
                        <FieldLabel>
                            Assign to Sections{' '}
                            <span className="text-red-500">*</span>
                        </FieldLabel>

                        <FieldContent>
                            <div className="space-y-2">
                                {/* SELECTED BADGES */}
                                {data.ossp_sections_ids.length > 0 && (
                                    <div className="rounded-md border p-2">
                                        {(() => {
                                            const selectedSections =
                                                osspSections.filter((s) =>
                                                    data.ossp_sections_ids.includes(
                                                        String(s.id),
                                                    ),
                                                );

                                            const visibleSections =
                                                expandedSections
                                                    ? selectedSections
                                                    : selectedSections.slice(
                                                          0,
                                                          3,
                                                      );

                                            const remainingCount =
                                                selectedSections.length -
                                                visibleSections.length;

                                            return (
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        {visibleSections.map(
                                                            (section) => (
                                                                <span
                                                                    key={
                                                                        section.id
                                                                    }
                                                                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
                                                                >
                                                                    <span className="max-w-[160px] truncate whitespace-nowrap">
                                                                        {
                                                                            section.sections_name
                                                                        }
                                                                    </span>

                                                                    <Button
                                                                        type="button"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-4 w-4 p-0"
                                                                        onClick={() =>
                                                                            toggleSection(
                                                                                section.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </span>
                                                            ),
                                                        )}

                                                        {/* MORE */}
                                                        {!expandedSections &&
                                                            remainingCount >
                                                                0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setExpandedSections(
                                                                            true,
                                                                        )
                                                                    }
                                                                    className="rounded-full bg-secondary px-2 py-1 text-xs hover:bg-secondary/80"
                                                                >
                                                                    +
                                                                    {
                                                                        remainingCount
                                                                    }{' '}
                                                                    more
                                                                </button>
                                                            )}
                                                    </div>

                                                    {/* SHOW LESS */}
                                                    {expandedSections &&
                                                        selectedSections.length >
                                                            3 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setExpandedSections(
                                                                        false,
                                                                    )
                                                                }
                                                                className="text-xs text-muted-foreground hover:underline"
                                                            >
                                                                Show less
                                                            </button>
                                                        )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* POPOVER */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={`w-full justify-between ${
                                                errors.ossp_sections_ids
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                        >
                                            <span className="truncate">
                                                {data.ossp_sections_ids.length
                                                    ? `${data.ossp_sections_ids.length} selected`
                                                    : 'SELECT SECTION(S)'}
                                            </span>

                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search section..." />

                                            <CommandList className="max-h-60 overflow-y-auto">
                                                <CommandEmpty>
                                                    No results found.
                                                </CommandEmpty>

                                                <CommandGroup>
                                                    {availableSections.length >
                                                        0 && (
                                                        <CommandItem
                                                            onSelect={
                                                                toggleAllSections
                                                            }
                                                            className="font-medium"
                                                        >
                                                            <div className="flex w-full items-center justify-between">
                                                                <span>
                                                                    {isAllSelected
                                                                        ? 'Deselect All Sections'
                                                                        : 'Select All Sections'}
                                                                </span>

                                                                <Check
                                                                    className={`h-4 w-4 ${
                                                                        isAllSelected
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0'
                                                                    }`}
                                                                />
                                                            </div>
                                                        </CommandItem>
                                                    )}

                                                    {osspSections.map(
                                                        (section) => {
                                                            const isAssigned =
                                                                localAssignments.some(
                                                                    (a) =>
                                                                        a
                                                                            .section
                                                                            .id ===
                                                                        section.id,
                                                                );

                                                            const isSelected =
                                                                data.ossp_sections_ids.includes(
                                                                    String(
                                                                        section.id,
                                                                    ),
                                                                );

                                                            return (
                                                                <CommandItem
                                                                    key={
                                                                        section.id
                                                                    }
                                                                    onSelect={() =>
                                                                        toggleSection(
                                                                            section.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isAssigned
                                                                    }
                                                                    className={`flex items-center justify-between ${
                                                                        isAssigned
                                                                            ? 'cursor-not-allowed opacity-50'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <span className="truncate">
                                                                        {
                                                                            section.sections_name
                                                                        }

                                                                        {isAssigned && (
                                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                                (already
                                                                                assigned)
                                                                            </span>
                                                                        )}
                                                                    </span>

                                                                    {isSelected && (
                                                                        <Check className="ml-2 h-4 w-4" />
                                                                    )}
                                                                </CommandItem>
                                                            );
                                                        },
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </FieldContent>

                        {errors.ossp_sections_ids && (
                            <FieldError>
                                Select at least one (1) Section
                            </FieldError>
                        )}
                    </Field>

                    {/* Remarks */}
                    <Field>
                        <FieldLabel>Remarks</FieldLabel>
                        <FieldContent>
                            <Textarea
                                value={data.assigned_remarks}
                                onChange={(e) =>
                                    setData('assigned_remarks', e.target.value)
                                }
                                placeholder="Optional remarks"
                            />
                        </FieldContent>
                        {errors.assigned_remarks && (
                            <FieldError>{errors.assigned_remarks}</FieldError>
                        )}
                    </Field>
                </FieldGroup>

                <Button type="submit" disabled={processing}>
                    Assign Document
                </Button>
            </form>

            {/* ==== EXISTING ASSIGNMENTS ==== */}
            <div className="mt-6 space-y-6">
                {Object.entries(assignmentsByCreator).map(
                    ([creatorName, creatorAssignments]) => (
                        <div key={creatorName} className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500">
                                {creatorName}
                            </h4>
                            {creatorAssignments.map((assign) => {
                                const canEdit =
                                    assign.creator?.id === currentUser.id ||
                                    currentUser.role_id === 1;
                                return (
                                    <AlertDialog key={assign.id}>
                                        <div className="flex items-start justify-between rounded-md border p-3">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {assign.assigned_remarks ||
                                                        'No remarks'}
                                                </p>
                                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>
                                                        {assign.section
                                                            ?.sections_name ??
                                                            'Unknown Section'}
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[assign.status?.id ?? 0] ?? 'border-gray-200 bg-gray-100 text-gray-700'}`}
                                                    >
                                                        {assign.status
                                                            ?.status_name ??
                                                            'Assigned'}
                                                    </span>
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Assigned on:{' '}
                                                    {assign.created_at
                                                        ? new Date(
                                                              assign.created_at,
                                                          ).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Received on:{' '}
                                                    {assign.status_2_date
                                                        ? new Date(
                                                              assign.status_2_date,
                                                          ).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Accomplished on:{' '}
                                                    {assign.status_3_date
                                                        ? new Date(
                                                              assign.status_3_date,
                                                          ).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                            </div>

                                            {canEdit && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setEditingAssignment(
                                                                    assign,
                                                                )
                                                            }
                                                            className="flex items-center gap-2"
                                                        >
                                                            <SquarePen className="h-4 w-4" />{' '}
                                                            Edit Assignment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                setDeleteAssignment(
                                                                    assign,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />{' '}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </AlertDialog>
                                );
                            })}
                        </div>
                    ),
                )}
            </div>

            {/* ==== DELETE CONFIRM DIALOG ==== */}
            {deleteAssignment && (
                <AlertDialog
                    open={true}
                    onOpenChange={() => setDeleteAssignment(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this assignment?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="mt-4 flex justify-end gap-2">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    confirmRemoveAssignedSection(
                                        deleteAssignment.id,
                                    );
                                    setDeleteAssignment(null);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* ==== EDIT ASSIGNMENT DIALOG ==== */}
            {editingAssignment && (
                <EditAssignDialog
                    assignment={editingAssignment}
                    onClose={() => setEditingAssignment(null)}
                />
            )}
        </>
    );
}
