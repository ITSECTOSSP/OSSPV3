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
import { useEffect, useState } from 'react';
import CouncilorMultiSelect from '../councilor/multi-select';

type LegislativeProposeFormData = {
    propose_no: string;
    propose_title: string;
    measure_type_id: string;

    city_council_id: string;

    proponent_ids: string[];

};

type LegislativeProposeFormProps = {
    data: LegislativeProposeFormData;
    setData: (key: keyof LegislativeProposeFormData, value: any) => void;
    measureTypes: LegislativeMeasureType[];
    citycouncils: LegislativeCityCouncil[];
    processing: boolean;
    errors: Partial<Record<keyof LegislativeProposeFormData, string>>;
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

export default function LegislativeProposeForm({
    data,
    setData,
    measureTypes,
    citycouncils,
    processing,
    errors,
    onSubmit,
    mode,
}: LegislativeProposeFormProps) {
    const inputClass = (field: keyof LegislativeProposeFormData) =>
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
                        <FieldLabel>PROPOSE NO.</FieldLabel>

                        <FieldContent>
                            <Input
                                value={data.propose_no}
                                onChange={(e) =>
                                    setData('propose_no', e.target.value)
                                }
                                className={inputClass('propose_no')}
                            />
                        </FieldContent>

                        {errors.propose_no && (
                            <FieldError>Propose NO. is required</FieldError>
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
                <FieldLabel>PROPOSE TITLE</FieldLabel>

                <FieldContent>
                    <Textarea
                        value={data.propose_title}
                        onChange={(e) =>
                            setData('propose_title', e.target.value)
                        }
                        className={inputClass('propose_title')}
                    />
                </FieldContent>

                {errors.propose_title && (
                    <FieldError>Propose Title is required</FieldError>
                )}
            </Field>

            {/* PROPONENTS */}
            <CouncilorMultiSelect
                label="Proponents"
                placeholder="Select propponents"
                value={data.proponent_ids}
                onChange={(val) => setData('proponent_ids', val)}
                councilors={councilors}
                error={errors.proponent_ids}
                disabled={!data.city_council_id}
            />


            {/* SUBMIT */}
            <Button type="submit" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : mode === 'edit'
                      ? 'Update Propose Measure'
                      : 'Create Proposed Measure'}
            </Button>
        </form>
    );
}
