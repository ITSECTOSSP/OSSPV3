import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Assignment } from '@/types/document-tracking';

type Props = {
    assignment: Assignment;
    onClose: () => void;
};

interface EditAssignDialogProps {
    assignment: Assignment;
    onClose: () => void;
    currentUser: { id: number; name: string }; // add this
}

export default function EditAssignDialog({ assignment, onClose }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        assigned_remarks: assignment.assigned_remarks ?? '',
    });


    const submit = (e: React.FormEvent) => {
        e.preventDefault();

         put(route('document-tracking.assign.update', assignment.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });

    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Assignment</AlertDialogTitle>
                    <AlertDialogDescription>
                        Update the remarks for this assignment.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={submit} className="mt-2 space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Remarks</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={data.assigned_remarks}
                                    onChange={(e) =>
                                        setData(
                                            'assigned_remarks',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Edit remarks..."
                                    rows={4}
                                />
                            </FieldContent>
                            {errors.assigned_remarks && (
                                <FieldError>
                                    {errors.assigned_remarks}
                                </FieldError>
                            )}
                        </Field>
                    </FieldGroup>

                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}