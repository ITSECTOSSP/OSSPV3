import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { format } from 'date-fns';
import { CalendarIcon, FileText, List, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

type FiltersProps = {
    filters: {
        per_page: number;
        search?: string;
        measure_type_id?: string;
        city_council_id?: string;
        series_year?: string;

        enact_start_date?: string;
        enact_end_date?: string;
    };

    measureType: { id: number; measure_name: string }[];
    cityCouncil: { id: number; council_name: string }[];

    years: number[];

    onFilterChange: (key: string, value: string) => void;
};

export default function LegislativeFilters({
    filters,
    measureType,
    cityCouncil,
    years,
    onFilterChange,
}: FiltersProps) {
    const [searches, setSearches] = useState<string[]>([]);
    const [input, setInput] = useState('');

    // helper (optional but cleaner)
    const isActive = (value?: string | number) =>
        value !== undefined &&
        value !== null &&
        String(value) !== '' &&
        String(value) !== 'all';

    const [dateRange, setDateRange] = useState<DateRange>({
        from: filters.enact_start_date
            ? new Date(filters.enact_start_date)
            : undefined,
        to: filters.enact_end_date
            ? new Date(filters.enact_end_date)
            : undefined,
    });

    const addSearch = () => {
        const value = input.trim();
        if (!value) return;

        if (!searches.includes(value)) {
            const updated = [...searches, value];
            setSearches(updated);
            onFilterChange('search', JSON.stringify(updated)); // send to backend
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

    // ENACT ADOPT DATE
    useEffect(() => {
        if (dateRange?.from) {
            const d = new Date(dateRange.from);
            d.setHours(0, 0, 0, 0);
            onFilterChange('enact_start_date', d.toISOString());
        } else {
            onFilterChange('enact_start_date', '');
        }

        if (dateRange?.to) {
            const d = new Date(dateRange.to);
            d.setHours(23, 59, 59, 999);
            onFilterChange('enact_end_date', d.toISOString());
        } else {
            onFilterChange('enact_end_date', '');
        }
    }, [dateRange]);

    const selectClass = 'w-full h-10 flex items-center gap-2 px-3';

    return (
        <div className="m-1 flex w-full flex-col gap-3">
            {/* SEARCH */}
            <div className="flex flex-wrap gap-2 rounded-md border p-2">
                {/* Pills */}
                {searches.map((item) => (
                    <span
                        key={item}
                        className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-white"
                    >
                        <span className="max-w-[120px] truncate sm:max-w-none">
                            {item}
                        </span>

                        <button
                            onClick={() => removeSearch(item)}
                            className="ml-1 text-white hover:text-red-200"
                        >
                            ✕
                        </button>
                    </span>
                ))}

                {/* Input */}
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

            {/* FILTERS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* MEASURE TYPE */}
                <div className="w-full">
                    <Select
                        value={filters.measure_type_id ?? 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                'measure_type_id',
                                value === 'all' ? '' : value,
                            )
                        }
                    >
                        <SelectTrigger
                            className={`w-full ${selectClass} ${
                                isActive(filters.measure_type_id)
                                    ? 'bg-primary text-white'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <SelectValue placeholder="Measure Type" />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Types</SelectItem>

                                {measureType.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.measure_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* CITY COUNCIL */}
                <div className="w-full">
                    <Select
                        value={filters.city_council_id ?? 'all'}
                        onValueChange={(value) =>
                            onFilterChange(
                                'city_council_id',
                                value === 'all' ? '' : value,
                            )
                        }
                    >
                        <SelectTrigger
                            className={`w-full ${selectClass} ${
                                isActive(filters.city_council_id)
                                    ? 'bg-primary text-white'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <List className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <SelectValue placeholder="City Council" />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">
                                    All Councils
                                </SelectItem>

                                {cityCouncil.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.council_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* YEAR */}
                <div className="w-full">
                    <Select
                        value={
                            filters.series_year
                                ? String(filters.series_year)
                                : 'all'
                        }
                        onValueChange={(value) => {
                            const v = value === 'all' ? '' : value;

                            onFilterChange('series_year', v);
                        }}
                    >
                        <SelectTrigger
                            className={`w-full ${selectClass} ${
                                isActive(filters.series_year)
                                    ? 'bg-primary text-white'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <SelectValue placeholder="Year" />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Years</SelectItem>

                                {years.map((year) => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* ENACT DATE RANGE */}
                <div className="w-full">
                    <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        Enact / Adopt Date
                    </h4>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-between overflow-hidden text-left ${
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
                                            : format(
                                                  dateRange.from,
                                                  'MMM dd, yyyy',
                                              )
                                        : 'Select Date Range'}
                                </span>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto max-w-[95vw] overflow-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={(range) =>
                                    setDateRange({
                                        from: range?.from,
                                        to: range?.to,
                                    })
                                }
                                numberOfMonths={window.innerWidth < 640 ? 1 : 2}
                                captionLayout="dropdown"
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
