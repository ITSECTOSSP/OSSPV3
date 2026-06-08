import { Button } from '@/components/ui/button';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';

type Props = {
    id?: number;
    initialValue: string;
    label: string;
    placeholder?: string;

    fieldName: string; // ✅ REQUIRED (no default trap anymore)

    storeRoute: string;
    updateRoute: (id: number) => string;

    createText: string;
    updateText: string;
};

export default function NameForm({
    id,
    initialValue,
    label,
    placeholder,
    fieldName,
    storeRoute,
    updateRoute,
    createText,
    updateText,
}: Props) {
    const isEdit = !!id;

    const { data, setData, post, put, processing, errors } = useForm<
        Record<string, string>
    >({
        [fieldName]: initialValue || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(updateRoute(id!), {
                preserveScroll: true,
            });
        } else {
            post(storeRoute, {
                preserveScroll: true,
            });
        }
    };

    const value = data[fieldName];
    const error = errors[fieldName];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
                <FieldLabel>{label.toUpperCase()}</FieldLabel>

                <FieldContent>
                    <Input
                        value={value}
                        onChange={(e) =>
                            setData(fieldName, e.target.value)
                        }
                        placeholder={placeholder}
                        className={`w-full rounded px-3 py-2 border transition-colors bg-transparent ${
                            error
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-blue-500'
                        }`}
                    />
                </FieldContent>

                {error && <FieldError>{label} is required</FieldError>}
            </Field>
            
            <Button type="submit" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : isEdit
                      ? updateText
                      : createText}
            </Button>
        </form>
    );
}