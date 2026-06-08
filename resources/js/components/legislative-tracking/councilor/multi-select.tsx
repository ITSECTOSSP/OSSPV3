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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { getPillColor } from '@/utils/pills';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type Councilor = {
    id: number;
    councilor_name: string;
};

type Props = {
    label: string;
    placeholder: string;

    value?: string[];
    onChange: (value: string[]) => void;

    councilors: Councilor[];

    disabledIds?: string[];
    error?: string;
    disabled?: boolean;
};

export default function CouncilorMultiSelect({
    label,
    placeholder,
    value = [],
    onChange,
    councilors,
    disabledIds = [],
    error,
}: Props) {
    const selected = value ?? [];

    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const disabledSet = useMemo(() => new Set(disabledIds), [disabledIds]);

    const availableCouncilors = useMemo(
        () => councilors.filter((c) => !disabledSet.has(String(c.id))),
        [councilors, disabledSet],
    );

    const isAllSelected =
        availableCouncilors.length > 0 &&
        availableCouncilors.every((c) => selectedSet.has(String(c.id)));

    const toggle = (id: string) => {
        if (disabledSet.has(id)) return;

        const exists = selectedSet.has(id);

        onChange(exists ? selected.filter((x) => x !== id) : [...selected, id]);
    };

    const toggleAll = () => {
        if (isAllSelected) {
            // Deselect all
            onChange([]);
        } else {
            // Select all available
            onChange(availableCouncilors.map((c) => String(c.id)));
        }
    };

    const removeItem = (id: string) => {
        onChange(selected.filter((x) => x !== id));
    };

    const selectedNames = useMemo(() => {
        if (!selected.length) return '';

        return councilors
            .filter((c) => selectedSet.has(String(c.id)))
            .map((c) => c.councilor_name)
            .join(', ');
    }, [selected, councilors, selectedSet]);

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            {/* BADGES */}
            {selected.length > 0 &&
                (() => {
                    const selectedCouncilors = councilors.filter((c) =>
                        selectedSet.has(String(c.id)),
                    );

                    const visibleCouncilors = expanded
                        ? selectedCouncilors
                        : selectedCouncilors.slice(0, 3);

                    const remainingCount =
                        selectedCouncilors.length - visibleCouncilors.length;

                    return (
                        <div className="space-y-2 rounded-md border p-2">
                            <div className="flex flex-wrap gap-2">
                                {visibleCouncilors.map((c) => (
                                    <span
                                        key={c.id}
                                        className={`flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-xs whitespace-nowrap ${getPillColor(
                                            c.id,
                                        )}`}
                                    >
                                        <span className="max-w-[120px] truncate sm:max-w-[180px]">
                                            {c.councilor_name}
                                        </span>

                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                                removeItem(String(c.id))
                                            }
                                            aria-label={`Remove ${c.councilor_name}`}
                                            className="h-4 w-4 shrink-0 p-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </span>
                                ))}

                                {/* MORE BADGE */}
                                {!expanded && remainingCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setExpanded(true)}
                                        className="rounded-full bg-secondary px-2 py-1 text-xs hover:bg-secondary/80"
                                    >
                                        +{remainingCount} more
                                    </button>
                                )}
                            </div>

                            {/* COLLAPSE BUTTON */}
                            {expanded && selectedCouncilors.length > 3 && (
                                <button
                                    type="button"
                                    onClick={() => setExpanded(false)}
                                    className="text-xs text-muted-foreground hover:underline"
                                >
                                    Show less
                                </button>
                            )}
                        </div>
                    );
                })()}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`w-full justify-between overflow-hidden ${
                            error ? 'border-red-500' : ''
                        }`}
                    >
                        <span className="block max-w-[90%] truncate">
                            {selected.length
                                ? `${selected.length} selected`
                                : placeholder}
                        </span>

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder="Search..." />

                        <CommandList className="max-h-60 overflow-y-auto">
                            <CommandEmpty>No results</CommandEmpty>

                            <CommandGroup>
                                {/* TOGGLE ALL */}
                                <CommandItem onSelect={toggleAll}>
                                    <span className="font-medium">
                                        {isAllSelected
                                            ? 'Deselect All'
                                            : 'Select All'}
                                    </span>
                                </CommandItem>

                                {councilors.map((c) => {
                                    const id = String(c.id);
                                    const isSelected = selectedSet.has(id);
                                    const isDisabled = disabledSet.has(id);

                                    return (
                                        <CommandItem
                                            key={id}
                                            onSelect={() => toggle(id)}
                                            disabled={isDisabled}
                                            className={`flex items-center justify-between ${
                                                isDisabled
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }`}
                                        >
                                            <span>{c.councilor_name}</span>

                                            {isSelected && (
                                                <Check className="ml-2 h-4 w-4" />
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
