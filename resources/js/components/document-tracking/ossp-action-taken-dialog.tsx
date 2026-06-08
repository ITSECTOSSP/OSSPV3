import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
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

type Props = {
    replyId: number;
    action?: {
        id: number;
        action_taken_text: string;
    };
    onClose: () => void;
};

export default function ActionTakenDialog({ replyId, action, onClose }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        action_taken_text: action?.action_taken_text || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (action) {
            put(route('document-tracking.reply.action.update', action.id), {
                preserveScroll: true,
                onSuccess: onClose,
            });
        } else {
            post(route('document-tracking.reply.action.store', replyId), {
                preserveScroll: true,
                onSuccess: onClose,
            });
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {action ? 'Edit' : 'Add'} Action Taken
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Provide the action taken for this reply.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* ✅ FORM INSIDE */}
                <form onSubmit={submit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Action Taken</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={data.action_taken_text}
                                    onChange={(e) =>
                                        setData(
                                            'action_taken_text',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter action taken..."
                                />
                            </FieldContent>

                            {errors.action_taken_text && (
                                <FieldError>
                                    {errors.action_taken_text}
                                </FieldError>
                            )}
                        </Field>
                    </FieldGroup>

                    <AlertDialogFooter>
                        {/* ✅ Cancel button (built-in) */}
                        <AlertDialogCancel onClick={onClose}>
                            Cancel
                        </AlertDialogCancel>

                        {/* ❗ DO NOT use AlertDialogAction for forms */}
                        <Button type="submit" disabled={processing}>
                            {action ? 'Update' : 'Add'}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}