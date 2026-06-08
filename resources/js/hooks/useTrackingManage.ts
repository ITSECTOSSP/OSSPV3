import Echo from '@/lib/echo';
import { Assignment, Reply, TrackingTitle } from '@/types/document-tracking';
import { useEffect, useState } from 'react';

type Options = {
    sectionId?: number;
    divisionId?: number;
};

export function useManageTracking(
    initialTitle: TrackingTitle,
    options?: Options,
) {
    const [title, setTitle] = useState<TrackingTitle>({
        ...initialTitle,
        replies: initialTitle.replies ?? [],
        assignments: initialTitle.assignments ?? [],
        files: initialTitle.files ?? [],
    });

    const mergeAssignments = (prev: TrackingTitle, next: TrackingTitle) => {
        if (!next.assignments) return prev.assignments;

        return prev.assignments.map((oldAssign) => {
            const updated = next.assignments.find((a) => a.id === oldAssign.id);

            return updated ? { ...oldAssign, ...updated } : oldAssign;
        });
    };

    // Resync if parent data changes
    useEffect(() => {
        console.log('🔄 Resync initial title', initialTitle.id);
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        console.log('📡 Subscribing to dashboard channel for title', title.id);
        const channel = Echo.channel('dashboard');

        const handleEvent = (event: any) => {
            if (!event?.data) return;

            console.log('🔥 Event received:', event.type, event.data);

            const updatedTitle = event.data.full_title || event.data;

            setTitle((prev) => {
                switch (event.type) {
                    // Title or assignment updated
                    case 'tracking_title_updated': {
                        const updatedTitle = event.data?.title ?? event.data;

                        return {
                            ...prev,
                            ...updatedTitle,

                            // 🔥 CRITICAL: merge assignments deeply
                            assignments: updatedTitle.assignments
                                ? updatedTitle.assignments.map(
                                      (newAssign: Assignment) => {
                                          const old = prev.assignments?.find(
                                              (a) => a.id === newAssign.id,
                                          );

                                          return old
                                              ? { ...old, ...newAssign }
                                              : newAssign;
                                      },
                                  )
                                : prev.assignments,
                        };
                    }

                    case 'tracking_assigned_updated': {
                        const updatedTitle = event.data?.full_title;

                        if (!updatedTitle) return prev;

                        return {
                            ...prev,
                            ...updatedTitle,

                            // 🔥 FIX: properly merge nested assignments
                            assignments: mergeAssignments(prev, updatedTitle),
                        };
                    }
                    // Assignment deleted
                    case 'tracking_assigned_deleted':
                        console.log(
                            '🗑 Removing deleted assignment',
                            event.data.deleted_assignment_id,
                        );
                        return {
                            ...prev,
                            assignments: prev.assignments?.filter(
                                (a) =>
                                    a.id !== event.data.deleted_assignment_id,
                            ),
                        };

                    // Reply created
                    case 'tracking_reply_created': {
                        const newReply = event.data?.reply;
                        const updatedTitle = event.data?.title;

                        if (!newReply) return prev;

                        const replies: Reply[] =
                            updatedTitle?.replies ?? prev.replies ?? [];

                        return {
                            ...prev,
                            ...(updatedTitle ?? {}),

                            replies: replies
                                .filter((r: Reply) => r.id !== newReply.id)
                                .concat({
                                    ...newReply,
                                    section: newReply.section ?? null,
                                    creator: newReply.creator ?? null,
                                    actions_taken:
                                        newReply.actionsTaken ??
                                        newReply.actions_taken ??
                                        [],
                                }),
                        };
                    }
                    // File uploaded
                    case 'tracking_files_uploaded': {
                        const newFile = event.data;

                        // ✅ Make sure it's for this title
                        if (
                            Number(newFile.tracking_titles_id) !==
                            Number(prev.id)
                        ) {
                            return prev;
                        }

                        return {
                            ...prev,
                            files: [
                                ...(prev.files || [])
                                    // ❌ remove temp file (match by name + size)
                                    .filter(
                                        (f) =>
                                            !(
                                                f.tfiles_original_name ===
                                                    newFile.tfiles_original_name &&
                                                Number(f.tfiles_file_size) ===
                                                    Number(
                                                        newFile.tfiles_file_size,
                                                    )
                                            ),
                                    ),
                                newFile, // ✅ real file replaces temp
                            ],
                        };
                    }

                    // File deleted
                    case 'tracking_file_deleted': {
                        const deletedFile = event.data;
                        console.log('🗑 File deleted event:', deletedFile);

                        // Only remove if it belongs to this title
                        if (
                            Number(deletedFile.tracking_titles_id) !==
                            Number(prev.id)
                        ) {
                            return prev;
                        }

                        return {
                            ...prev,
                            files: (prev.files || []).filter(
                                (f) => f.id !== deletedFile.id,
                            ),
                        };
                    }
                    default:
                        console.log('⚠️ Unhandled event type:', event.type);
                        return prev;
                }
            });
        };

        channel.listen('.dashboard.updated', handleEvent);

        return () => {
            console.log('📴 Leaving dashboard channel for title', title.id);
            Echo.leaveChannel('dashboard');
        };
    }, [title.id, options?.divisionId, options?.sectionId]);

    return title;
}
