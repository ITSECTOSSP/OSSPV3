import CityCouncilMultiSelect from '@/components/legislative-tracking/city-council/multi-select';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    LegislativeCityCouncil,
    LegislativeCityCouncilor,
    LegislativeDistrict,
} from '@/types/legislative-tracking';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface CouncilorFormData {
    councilor_name: string;
    district_id: string;
    contact: string;
    details: string;
    city_councils: string[];
}

interface Props {
    districts: LegislativeDistrict[];
    cityCouncils: LegislativeCityCouncil[];
    councilor?: LegislativeCityCouncilor;
}

export default function CouncilorForm({
    districts,
    cityCouncils,
    councilor,
}: Props) {
    const isEdit = !!councilor;

    const { data, setData, post, put, processing, errors } =
        useForm<CouncilorFormData>({
            councilor_name: councilor?.councilor_name || '',
            district_id: councilor?.district_id
                ? String(councilor.district_id)
                : '',
            contact: councilor?.contact || '',
            details: councilor?.details || '',
            city_councils: councilor?.city_councils
                ? councilor.city_councils.map((c) => String(c.id))
                : [],
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin-panel.city-councilors.update', councilor.id));
        } else {
            post(route('admin-panel.city-councilors.store'));
        }
    };

    // ✅ SAME STYLE AS TRACKING FORM
    const inputClass = (hasError?: boolean) =>
        `w-full rounded px-3 py-2 border transition-colors bg-transparent ${
            hasError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* LEFT SIDE BASIC INFO */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                    <FieldLabel>Councilor Name</FieldLabel>
                    <FieldContent>
                        <Input
                            value={data.councilor_name}
                            onChange={(e) =>
                                setData('councilor_name', e.target.value)
                            }
                            className={inputClass(!!errors.councilor_name)}
                            placeholder="Enter councilor name"
                        />
                    </FieldContent>
                    {errors.councilor_name && (
                        <FieldError>Councilor name is required</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel>District</FieldLabel>
                    <FieldContent>
                        <Select
                            value={data.district_id}
                            onValueChange={(value) =>
                                setData('district_id', value)
                            }
                        >
                            <SelectTrigger
                                className={inputClass(!!errors.district_id)}
                            >
                                <SelectValue placeholder="Select district" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Districts</SelectLabel>
                                    {districts.map((d) => (
                                        <SelectItem
                                            key={d.id}
                                            value={String(d.id)}
                                        >
                                            {d.district_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FieldContent>

                    {errors.district_id && (
                        <FieldError>District is required</FieldError>
                    )}
                </Field>
            </div>

            {/* CONTACT + CITY COUNCILS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                    <FieldLabel>Contact</FieldLabel>
                    <FieldContent>
                        <Input
                            value={data.contact}
                            onChange={(e) => setData('contact', e.target.value)}
                            className={inputClass(!!errors.contact)}
                            placeholder="Enter contact number"
                        />
                    </FieldContent>
                    {errors.contact && (
                        <FieldError>{errors.contact}</FieldError>
                    )}
                </Field>
                {/* CITY COUNCILS */}
                <Field>
                    <FieldLabel>City Councils</FieldLabel>
                    <FieldContent>
                        <CityCouncilMultiSelect
                            label=""
                            placeholder="Select city councils"
                            cityCouncils={cityCouncils}
                            value={data.city_councils}
                            onChange={(val) => setData('city_councils', val)}
                            error={errors.city_councils}
                        />
                    </FieldContent>

                    {errors.city_councils && (
                        <FieldError>{errors.city_councils}</FieldError>
                    )}
                </Field>
            </div>
              {/* DETAILS */}
            <Field>
                <FieldLabel>Details</FieldLabel>
                <FieldContent>
                    <Textarea
                        value={data.details}
                        onChange={(e) => setData('details', e.target.value)}
                        className={inputClass(!!errors.details)}
                        placeholder="Enter details"
                    />
                </FieldContent>
                {errors.details && <FieldError>{errors.details}</FieldError>}
            </Field>

            {/* SUBMIT */}
            <Button type="submit" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : isEdit
                      ? 'Update Councilor'
                      : 'Create Councilor'}
            </Button>
        </form>
    );
}
