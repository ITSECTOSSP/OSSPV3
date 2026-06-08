import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import {
    LegislativeCityCouncil,
    LegislativeCityCouncilor,
    LegislativeMeasureType,
} from '@/types/legislative-tracking';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import CouncilorMultiSelect from '../councilor/multi-select';

type LegislativeApproveFormData = {
    approve_no: string;
    approve_title: string;
    measure_type_id: string;

    city_council_id: string;

    enact_adopt_date: string;
    series_year: string;

    introducer_ids: string[];
    co_introducer_ids: string[];
};

type LegislativeApproveFormProps = {
    data: LegislativeApproveFormData;
    setData: (key: keyof LegislativeApproveFormData, value: any) => void;
    measureTypes: LegislativeMeasureType[];
    citycouncils: LegislativeCityCouncil[];
    processing: boolean;
    errors: Partial<Record<keyof LegislativeApproveFormData, string>>;
    onSubmit: (e: React.FormEvent) => void;
    mode?: 'create' | 'edit';
};

export function useCouncilors(councilId: string | null) {
    const [councilors, setCouncilors] = useState<LegislativeCityCouncilor[]>(
        [],
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!councilId) {
            setCouncilors([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                const { data } = await api.get('/legislative/councilors', {
                    params: {
                        city_council_ids: [councilId],
                    },
                });

                setCouncilors(data ?? []);
            } catch (error) {
                console.error('Failed to fetch councilors:', error);
                setCouncilors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [councilId]);

    return { councilors, loading };
}

export default function LegislativeApproveForm({
    data,
    setData,
    measureTypes,
    citycouncils,
    processing,
    errors,
    onSubmit,
    mode,
}: LegislativeApproveFormProps) {
    const inputClass = (field: keyof LegislativeApproveFormData) =>
        `w-full rounded-md border ${
            errors[field]
                ? 'border-red-500 focus:border-red-500'
                : 'border-input focus:border-ring'
        } bg-background transition-colors`;

    const { councilors, loading } = useCouncilors(data.city_council_id);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* ROW */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                {/* LEFT */}
                <div className="flex flex-1 flex-col space-y-4">
                    <Field>
                        <FieldLabel>APPROVE NO.</FieldLabel>

                        <FieldContent>
                            <Input
                                value={data.approve_no}
                                onChange={(e) =>
                                    setData('approve_no', e.target.value)
                                }
                                className={inputClass('approve_no')}
                            />
                        </FieldContent>

                        {errors.approve_no && (
                            <FieldError>Approve NO. is required</FieldError>
                        )}
                    </Field>
                </div>

                {/* RIGHT */}
                <div className="flex flex-1 flex-col space-y-4">
                    <Field>
                        <FieldLabel>MEASURE TYPE</FieldLabel>

                        <FieldContent>
                            <Select
                                value={data.measure_type_id}
                                onValueChange={(value) =>
                                    setData('measure_type_id', value)
                                }
                            >
                                <SelectTrigger
                                    className={inputClass('measure_type_id')}
                                >
                                    <SelectValue placeholder="Select Measure Type" />
                                </SelectTrigger>

                                <SelectContent>
                                    {measureTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={String(type.id)}
                                        >
                                            {type.measure_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>

                        {errors.measure_type_id && (
                            <FieldError>
                                Select at least one (1) Measure Type
                            </FieldError>
                        )}
                    </Field>
                </div>
            </div>

            {/* DATE + SERIES YEAR */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                {/* ADOPT / ENACT DATE */}
                <div className="flex flex-1 flex-col space-y-4">
                    <Field>
                        <FieldLabel>ADOPT / ENACT DATE</FieldLabel>

                        <FieldContent>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${
                                            !data.enact_adopt_date
                                                ? 'text-muted-foreground'
                                                : ''
                                        }`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                        {data.enact_adopt_date ? (
                                            format(
                                                new Date(data.enact_adopt_date),
                                                'PPP',
                                            )
                                        ) : (
                                            <span>Select date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.enact_adopt_date
                                                ? new Date(
                                                      data.enact_adopt_date,
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (!date) return;

                                            const formatted = date
                                                .toISOString()
                                                .split('T')[0];

                                            setData(
                                                'enact_adopt_date',
                                                formatted,
                                            );

                                            // auto-set year
                                            setData(
                                                'series_year',
                                                date.getFullYear().toString(),
                                            );
                                        }}
                                        initialFocus
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                        </FieldContent>

                        {errors.enact_adopt_date && (
                            <FieldError>
                                Adopt / Enact date is required
                            </FieldError>
                        )}
                    </Field>
                </div>

                {/* SERIES YEAR */}
                <div className="flex flex-1 flex-col space-y-4">
                    <Field>
                        <FieldLabel>SERIES YEAR</FieldLabel>

                        <FieldContent>
                            <Input
                                value={data.series_year}
                                onChange={(e) =>
                                    setData('series_year', e.target.value)
                                }
                                className={inputClass('series_year')}
                            />
                        </FieldContent>

                        {errors.series_year && (
                            <FieldError>Series year is required</FieldError>
                        )}
                    </Field>
                </div>
            </div>

            {/* CITY COUNCIL */}
            <div className="flex flex-1 flex-col space-y-4">
                <Field>
                    <FieldLabel>CITY COUNCIL</FieldLabel>

                    <FieldContent>
                        <Select
                            value={data.city_council_id}
                            onValueChange={(value) =>
                                setData('city_council_id', value)
                            }
                        >
                            <SelectTrigger
                                className={inputClass('city_council_id')}
                            >
                                <SelectValue placeholder="Select City Council" />
                            </SelectTrigger>

                            <SelectContent>
                                {citycouncils.map((council) => (
                                    <SelectItem
                                        key={council.id}
                                        value={String(council.id)}
                                    >
                                        {council.council_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>

                    {errors.city_council_id && (
                        <FieldError>Select a City Council</FieldError>
                    )}
                </Field>
            </div>

            {/* TITLE */}
            <Field>
                <FieldLabel>APPROVE TITLE</FieldLabel>

                <FieldContent>
                    <Textarea
                        value={data.approve_title}
                        onChange={(e) =>
                            setData('approve_title', e.target.value)
                        }
                        className={inputClass('approve_title')}
                    />
                </FieldContent>

                {errors.approve_title && (
                    <FieldError>Approve Title is required</FieldError>
                )}
            </Field>

            {/* INTRODUCERS */}
            <CouncilorMultiSelect
                label="Introducer"
                placeholder="Select introducers"
                value={data.introducer_ids}
                onChange={(val) => setData('introducer_ids', val)}
                councilors={councilors}
                disabledIds={data.co_introducer_ids}
                error={errors.introducer_ids}
            />

            {/* CO-INTRODUCERS */}
            <CouncilorMultiSelect
                label="Co-Introducer"
                placeholder="Select co-introducers"
                value={data.co_introducer_ids}
                onChange={(val) => setData('co_introducer_ids', val)}
                councilors={councilors}
                disabledIds={data.introducer_ids}
                error={errors.co_introducer_ids}
            />

            {/* SUBMIT */}
            <Button type="submit" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : mode === 'edit'
                      ? 'Update Approve Measure'
                      : 'Create Approved Measure'}
            </Button>
        </form>
    );
}
