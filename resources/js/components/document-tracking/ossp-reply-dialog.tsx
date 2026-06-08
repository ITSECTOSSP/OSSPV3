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
import { Reply } from '@/types/document-tracking';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { User } from '@/types';

type EditReplyDialogProps = {
    reply: Reply;
    onClose: () => void;
    currentUser: User;
};

export default function EditReplyDialog({
    reply,
    onClose,
}: EditReplyDialogProps) {
    const { data, setData, put, processing, errors } = useForm({
        remarks: reply.reply_remarks,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('document-tracking.reply.update', reply.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Reply</AlertDialogTitle>
                    <AlertDialogDescription>
                        Update the remarks for this reply.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={submit} className="mt-2 space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Remarks</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData('remarks', e.target.value)
                                    }
                                    placeholder="Edit your reply..."
                                    rows={4}
                                />
                            </FieldContent>
                            {errors.remarks && (
                                <FieldError>{errors.remarks}</FieldError>
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
