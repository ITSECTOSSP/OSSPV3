import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { Reply } from '@/types/document-tracking';
import { router, useForm } from '@inertiajs/react';
import { MoreHorizontal, SquareCheck, SquarePen, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import EditReplyDialog from '../ossp-reply-dialog';
import ActionTakenDialog from '../ossp-action-taken-dialog';
import { Separator } from '../../ui/separator';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

type ReplyFormProps = {
    trackingTitleId: number;
    replies?: Reply[];
    currentUser: User;
};

export default function ReplyForm({ trackingTitleId, replies = [], currentUser }: ReplyFormProps) {
    const { data, setData, post, processing, reset } = useForm({ remarks: '' });

    const [localReplies, setLocalReplies] = useState<Reply[]>(replies);
    const [editReply, setEditReply] = useState<Reply | null>(null);
    const [actionReply, setActionReply] = useState<Reply | null>(null);
    const [deleteReply, setDeleteReply] = useState<Reply | null>(null);

    // Submit a new reply
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('document-tracking.reply.store', trackingTitleId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    // Delete a reply
    const removeReply = (replyId: number) => {
        router.delete(route('document-tracking.reply.destroy', replyId), { preserveScroll: true });
    };

      useEffect(() => {
        setLocalReplies(replies);
    }, [replies]);

    return (
        <div className="space-y-6">
            {/* Reply Form */}
            <form onSubmit={submit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel>
                            Reply / Remarks
                            <span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                            <Textarea
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                                placeholder="Enter reply or remarks..."
                                className={`w-full rounded-md border p-2 transition-colors duration-300 border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white`}
                            />
                        </FieldContent>
                        <FieldError>{data.remarks ? '' : ''}</FieldError>
                    </Field>
                </FieldGroup>
                <Button type="submit" className="m-3" disabled={processing}>
                    Send Reply
                </Button>
            </form>

            {/* Replies List */}
            <div>
                <header className="mb-2 text-lg font-semibold">Replies</header>
                {localReplies.length ? (
                    <div className="space-y-2">
                        {localReplies.map(reply => {
                            const canEdit = reply.creator?.id === currentUser.id || currentUser.role_id === 1;
                            return (
                                <div
                                    key={reply.id}
                                    className="flex items-start justify-between rounded-md border p-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{reply.reply_remarks}</p>
                                        <p className="truncate text-sm text-muted-foreground">{reply.section?.sections_name ?? 'No Section'}</p>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {reply.creator?.full_name ?? 'Unknown User'} • {new Date(reply.created_at).toLocaleString()}
                                        </p>

                                        {reply.actions_taken?.length ? (
                                            <div className="mt-3">
                                                <Separator className="mb-2" />
                                                <p className="mb-2 text-xs font-semibold text-muted-foreground">Action Taken</p>
                                                <ul className="space-y-2 border-l pl-3">
                                                    {reply.actions_taken.map(a => (
                                                        <li key={a.id} className="flex items-start justify-between text-xs">
                                                            <span className="text-muted-foreground">{a.action_taken_text}</span>
                                                            <span className="ml-3 shrink-0 text-[10px] text-gray-400">{new Date(a.created_at).toLocaleString()}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Dropdown Menu for Edit/Delete/Action */}
                                    {canEdit && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => setEditReply(reply)}>
                                                    <SquarePen className="h-4 w-4" /> Edit Reply
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => setActionReply(reply)}>
                                                    <SquareCheck className="h-4 w-4" /> Accomplish
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-600" onClick={() => setDeleteReply(reply)}>
                                                    <Trash2 className="h-4 w-4 text-red-600" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                    {/* Modals */}
                                    {editReply && canEdit && <EditReplyDialog reply={editReply} currentUser={currentUser} onClose={() => setEditReply(null)} />}
                                    {actionReply && <ActionTakenDialog replyId={actionReply.id} onClose={() => setActionReply(null)} />}
                                    {deleteReply && canEdit && (
                                        <AlertDialog open={true} onOpenChange={() => setDeleteReply(null)}>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this reply?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-900"
                                                        onClick={() => { removeReply(deleteReply.id); setDeleteReply(null); }}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </div>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No replies yet</p>
                )}
            </div>
        </div>
    );
}