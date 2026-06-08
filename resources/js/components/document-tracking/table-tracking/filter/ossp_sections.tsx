import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Check, ChevronsUpDown, Layers } from 'lucide-react';
import { OsspSections } from '@/types';

type Props = {
    sections: OsspSections[];
    value: string[] | number[];
    onChange: (value: string[]) => void;

    label?: string;
    placeholder?: string;

    /** for filter usage */
    showLabel?: boolean;
};

export function SectionsField({
    sections,
    value,
    onChange,
    label = 'Assign to Sections',
    placeholder = 'SELECT SECTION(S)',
    showLabel = true,
}: Props) {
    const selectedStrings = value.map(String);

    const toggleSection = (id: string) => {
        if (selectedStrings.includes(id)) {
            onChange(selectedStrings.filter((s) => s !== id));
        } else {
            onChange([...selectedStrings, id]);
        }
    };

    const selectedLabels = sections
        .filter((s) => selectedStrings.includes(String(s.id)))
        .map((s) => s.sections_name);

    return (
        <Field>
            {showLabel && <FieldLabel>{label}</FieldLabel>}

            <FieldContent>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">
                                    {selectedLabels.length
                                        ? selectedLabels.join(', ')
                                        : placeholder}
                                </span>
                            </div>

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
                                    {sections.map((section) => {
                                        const isSelected =
                                            selectedStrings.includes(
                                                String(section.id),
                                            );

                                        return (
                                            <CommandItem
                                                key={section.id}
                                                onSelect={() =>
                                                    toggleSection(
                                                        String(section.id),
                                                    )
                                                }
                                                className="flex items-center justify-between"
                                            >
                                                <span>
                                                    {section.sections_name}
                                                </span>

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
            </FieldContent>
        </Field>
    );
}