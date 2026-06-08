import { Button } from '@/components/ui/button';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface FormData {
    council_name: string;
}

interface Props {
    cityCouncil?: {
        id: number;
        council_name: string;
    };
}

export default function CityCouncilForm({
    cityCouncil,
}: Props) {
    const isEdit = !!cityCouncil;

    const { data, setData, post, put, processing, errors } =
        useForm<FormData>({
            council_name: cityCouncil?.council_name || '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(
                route(
                    'admin-panel.city-councils.update',
                    cityCouncil.id,
                ),
            );
        } else {
            post(route('admin-panel.city-councils.store'));
        }
    };

    const inputClass = (hasError?: boolean) =>
        `w-full rounded px-3 py-2 border transition-colors bg-transparent ${
            hasError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
                <FieldLabel>CITY COUNCIL NAME</FieldLabel>

                <FieldContent>
                    <Input
                        value={data.council_name}
                        onChange={(e) =>
                            setData(
                                'council_name',
                                e.target.value,
                            )
                        }
                        className={inputClass(
                            !!errors.council_name,
                        )}
                        placeholder="Enter city council name"
                    />
                </FieldContent>

                {errors.council_name && (
                    <FieldError>
                        City Council Name is required
                    </FieldError>
                )}
            </Field>

            <Button type="submit" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : isEdit
                      ? 'Update City Council'
                      : 'Create City Council'}
            </Button>
        </form>
    );
}