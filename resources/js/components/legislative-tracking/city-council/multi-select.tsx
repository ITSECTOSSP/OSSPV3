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
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type CityCouncil = {
    id: number;
    council_name: string;
};

type Props = {
    label: string;
    placeholder: string;

    value: string[];
    onChange: (value: string[]) => void;

    cityCouncils: CityCouncil[];

    disabledIds?: string[];
    error?: string;
};

export default function CityCouncilMultiSelect({
    label,
    placeholder,
    value = [],
    onChange,
    cityCouncils,
    disabledIds = [],
    error,
}: Props) {
    const selectedSet = useMemo(() => new Set(value), [value]);
    const disabledSet = useMemo(() => new Set(disabledIds), [disabledIds]);

    const available = useMemo(
        () => cityCouncils.filter((c) => !disabledSet.has(String(c.id))),
        [cityCouncils, disabledSet],
    );

    const isAllSelected =
        available.length > 0 &&
        available.every((c) => selectedSet.has(String(c.id)));

    const toggle = (id: string) => {
        if (disabledSet.has(id)) return;

        const exists = selectedSet.has(id);

        onChange(
            exists
                ? value.filter((x) => x !== id)
                : [...value, id],
        );
    };

    const toggleAll = () => {
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange(available.map((c) => String(c.id)));
        }
    };

    const removeItem = (id: string) => {
        onChange(value.filter((x) => x !== id));
    };

    const selectedItems = useMemo(() => {
        return cityCouncils.filter((c) =>
            selectedSet.has(String(c.id)),
        );
    }, [cityCouncils, selectedSet]);

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            {/* SELECTED BADGES */}
            {value.length > 0 && (
                <div
                    className={cn(
                        'rounded-md border p-2',
                        error && 'border-red-500',
                    )}
                >
                    <div className="flex flex-wrap gap-2">
                        {(expanded
                            ? selectedItems
                            : selectedItems.slice(0, 3)
                        ).map((c) => (
                            <span
                                key={c.id}
                                className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                            >
                                <span className="max-w-[160px] truncate">
                                    {c.council_name}
                                </span>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                        removeItem(String(c.id))
                                    }
                                    className="h-4 w-4 p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </span>
                        ))}

                        {!expanded && selectedItems.length > 3 && (
                            <button
                                type="button"
                                onClick={() => setExpanded(true)}
                                className="rounded-full bg-secondary px-2 py-1 text-xs"
                            >
                                +{selectedItems.length - 3} more
                            </button>
                        )}
                    </div>

                    {expanded && selectedItems.length > 3 && (
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="mt-2 text-xs text-muted-foreground hover:underline"
                        >
                            Show less
                        </button>
                    )}
                </div>
            )}

            {/* TRIGGER + DROPDOWN */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-between',
                            error && 'border-red-500 focus:ring-red-500',
                        )}
                    >
                        <span className="truncate">
                            {value.length
                                ? `${value.length} selected`
                                : placeholder}
                        </span>

                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                {/* ✅ FIX: same width as button */}
                <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                >
                    <Command>
                        <CommandInput placeholder="Search..." />

                        <CommandList className="max-h-60 overflow-y-auto">
                            <CommandEmpty>No results</CommandEmpty>

                            <CommandGroup>
                                <CommandItem onSelect={toggleAll}>
                                    {isAllSelected
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </CommandItem>

                                {cityCouncils.map((c) => {
                                    const id = String(c.id);

                                    return (
                                        <CommandItem
                                            key={id}
                                            onSelect={() => toggle(id)}
                                        >
                                            <span>{c.council_name}</span>

                                            {selectedSet.has(id) && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* ✅ IMPROVED ERROR (same style as your FieldError system) */}
            {error && (
                <p className="text-sm text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
}