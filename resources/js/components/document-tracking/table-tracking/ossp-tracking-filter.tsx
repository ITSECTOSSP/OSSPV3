import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OsspSections } from '@/types';
import {
    DocumentType,
    TrackingClassification,
} from '@/types/document-tracking';
import { format } from 'date-fns';
import { CalendarIcon, FileText, List, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SectionsField } from './filter/ossp_sections';

type FiltersProps = {
    filters: {
        per_page: number;
        search?: string;
        document_type_id?: string;
        classifications_id?: string;
        section_id?: string[];
        start_date?: string;
        end_date?: string;
    };
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
    osspSections: OsspSections[];
    onFilterChange: (key: string, value: string | string[]) => void;
    showSectionFilter?: boolean;
    showDateAssignedFilter?: boolean;
};

export default function DocumentFilters({
    filters,
    documentTypes,
    trackingClassification,
    osspSections,
    onFilterChange,
    showSectionFilter = false,
    showDateAssignedFilter = false,
}: FiltersProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    //Date Range
    const [dateRange, setDateRange] = useState<DateRange>({
        from: filters.start_date ? new Date(filters.start_date) : undefined,
        to: filters.end_date ? new Date(filters.end_date) : undefined,
    });
    //Array Searching
    const [searches, setSearches] = useState<string[]>([]);
    const [input, setInput] = useState('');

    //Array search handler
    const addSearch = () => {
        const value = input.trim();
        if (!value) return;

        if (!searches.includes(value)) {
            const updated = [...searches, value];
            setSearches(updated);
            onFilterChange('search', JSON.stringify(updated));
        }

        setInput('');
    };

    const removeSearch = (item: string) => {
        const updated = searches.filter((x) => x !== item);
        setSearches(updated);
        onFilterChange('search', JSON.stringify(updated));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSearch();
        }
    };

    // Date range effect
    useEffect(() => {
        if (dateRange?.from) {
            const d = new Date(dateRange.from);
            d.setHours(0, 0, 0, 0);
            onFilterChange('start_date', d.toISOString());
        } else {
            onFilterChange('start_date', '');
        }

        if (dateRange?.to) {
            const d = new Date(dateRange.to);
            d.setHours(23, 59, 59, 999);
            onFilterChange('end_date', d.toISOString());
        } else {
            onFilterChange('end_date', '');
        }
    }, [dateRange]);

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            onFilterChange('search', search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    const selectClass = 'w-full h-10 flex items-center gap-2 px-3';

    return (
        <div className="m-1 flex w-full flex-col gap-3">
            {/* Search */}
            <div className="flex flex-wrap gap-2 rounded-md border p-2">
                {searches.map((item) => (
                    <span
                        key={item}
                        className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-white"
                    >
                        <span className="max-w-[120px] truncate">{item}</span>

                        <button
                            onClick={() => removeSearch(item)}
                            className="ml-1 text-white hover:text-red-200"
                        >
                            ✕
                        </button>
                    </span>
                ))}

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add keyword..."
                    className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
                />
            </div>
            {searches.length > 0 && (
                <div className="text-xs text-muted-foreground">
                    {searches.length} active keyword(s)
                </div>
            )}

            {/* Filters Row */}
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:flex-wrap">
                {/* Document Type */}
                <div className="w-full md:min-w-[120px] md:flex-1">
                    <Select
                        value={filters.document_type_id ?? 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                'document_type_id',
                                value === 'all' ? '' : value,
                            )
                        }
                    >
                        <SelectTrigger
                            className={`${selectClass} ${
                                filters.document_type_id
                                    ? 'bg-primary text-white'
                                    : ''
                            }`}
                        >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Document Type" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Types</SelectItem>
                                {documentTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={String(type.id)}
                                    >
                                        {type.types_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Classification */}
                <div className="w-full md:min-w-[120px] md:flex-1">
                    <Select
                        value={filters.classifications_id ?? 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                'classifications_id',
                                value === 'all' ? '' : value,
                            )
                        }
                    >
                        <SelectTrigger
                            className={`${selectClass} ${
                                filters.classifications_id
                                    ? 'bg-primary text-white'
                                    : ''
                            }`}
                        >
                            <List className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Classification" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">
                                    All Classifications
                                </SelectItem>
                                {trackingClassification.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.classifications_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>


                {/* Date Range */}
                <div className="w-full md:min-w-[240px] md:flex-1">
    <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        Created Date Range
    </h4>

    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                className={`w-full justify-between ${
                    dateRange.from || dateRange.to
                        ? 'bg-primary text-white'
                        : ''
                }`}
            >
                <span className="truncate">
                    {dateRange.from
                        ? dateRange.to
                            ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(
                                  dateRange.to,
                                  'MMM dd, yyyy',
                              )}`
                            : format(dateRange.from, 'MMM dd, yyyy')
                        : 'Select Date Range'}
                </span>
            </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                    setDateRange({
                        from: range?.from,
                        to: range?.to,
                    })
                }
                numberOfMonths={2}
                captionLayout="dropdown"
                initialFocus
            />
        </PopoverContent>
    </Popover>
</div>

                {/* Sections */}
                {showSectionFilter && (
                    <div className="w-full">
                        <SectionsField
                            sections={osspSections}
                            value={filters.section_id || []}
                            onChange={(val) =>
                                onFilterChange('section_id', val)
                            }
                            showLabel={false}
                            placeholder="Filter by sections"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
