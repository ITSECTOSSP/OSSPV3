import Echo from '@/lib/echo';
import { TrackingTitle } from '@/types/document-tracking';
import { useEffect, useRef, useState } from 'react';

type Options = {
    divisionId?: number;
    sectionId?: number;
    statusId?: number;
};

export function useRealtimeTitles(
    initialData: TrackingTitle[],
    options?: Options,
) {
    const [liveTitles, setLiveTitles] = useState<TrackingTitle[]>(initialData);

    const optionsRef = useRef(options);
    optionsRef.current = options;

    // sync with server props (Inertia refresh)
    useEffect(() => {
        setLiveTitles(initialData);
    }, [initialData]);

    const isAllowed = (item: TrackingTitle) => {
        const opt = optionsRef.current;

        if (!item.assignments?.length) return false;

        return item.assignments.some((a) => {
            const sectionMatch = opt?.sectionId
                ? Number(a.section?.id) === Number(opt.sectionId)
                : true;

            const statusMatch = opt?.statusId
                ? Number(a.status?.id) === Number(opt.statusId)
                : true;

            const divisionMatch = opt?.divisionId
                ? Number(a.section?.ossp_division_id) === Number(opt.divisionId)
                : true;

            return sectionMatch && statusMatch && divisionMatch;
        });
    };

    const upsertTitle = (prev: TrackingTitle[], updated: TrackingTitle) => {
        const exists = prev.some((i) => i.id === updated.id);

        const existing = prev.find((i) => i.id === updated.id);

        const merged: TrackingTitle = {
            ...(existing ?? {}),
            ...updated,
            notify_depthead:
                updated.notify_depthead ?? existing?.notify_depthead ?? false,
        };

        if (exists) {
            return prev.map((item) => (item.id === updated.id ? merged : item));
        }

        return [merged, ...prev];
    };

    useEffect(() => {
        const channel = Echo.channel('dashboard');

        const listener = (event: any) => {
            console.log('🔥 EVENT:', event);

            const { type, data } = event;

            setLiveTitles((prev) => {
                switch (type) {
                    case 'tracking_title_created':
                        return isAllowed(data) ? [data, ...prev] : prev;

                    case 'tracking_title_updated':
                        return upsertTitle(prev, data.title);

                    case 'tracking_assigned_updated': {
                        const { title_id, assignment } = data;

                        if (!assignment) return prev;

                        const existsInState = prev.some(
                            (t) => t.id === title_id,
                        );

                        // 🔥 TITLE NOT YET IN DASHBOARD
                        // fetch and insert it
                        if (!existsInState) {
                            fetch(`/api/tracking-titles/${title_id}`)
                                .then((res) => res.json())
                                .then((json) => {
                                    const fresh = json.data;

                                    setLiveTitles((current) => {
                                        // avoid duplicates
                                        const alreadyExists = current.some(
                                            (t) => t.id === fresh.id,
                                        );

                                        if (alreadyExists) return current;

                                        return [fresh, ...current];
                                    });
                                });

                            return prev;
                        }

                        // 🔥 UPDATE EXISTING TITLE
                        return prev.map((title) => {
                            if (title.id !== title_id) return title;

                            const assignments = title.assignments ?? [];

                            const exists = assignments.some(
                                (a) => a.id === assignment.id,
                            );

                            const updatedAssignments = exists
                                ? assignments.map((a) =>
                                      a.id === assignment.id ? assignment : a,
                                  )
                                : [...assignments, assignment];

                            return {
                                ...title,
                                assignments: [...updatedAssignments],
                            };
                        });
                    }

                    case 'tracking_title_deleted':
                        return prev.filter((i) => i.id !== data.id);

                    case 'tracking_reply_created':
                        return prev.map((item) =>
                            item.id === data.title_id
                                ? {
                                      ...item,

                                      // optional title updates
                                      ...data.title,

                                      replies: [
                                          ...(item.replies || []).filter(
                                              (r) => r.id !== data.reply.id,
                                          ),
                                          data.reply,
                                      ],
                                  }
                                : item,
                        );
                    case 'tracking_files_uploaded':
                        return prev.map((item) =>
                            item.id === data.title_id
                                ? {
                                      ...item,
                                      files: [
                                          ...(item.files || []),
                                          data.file ?? data,
                                      ],
                                  }
                                : item,
                        );

                    default:
                        return prev;
                }
            });
        };

        channel.listen('.dashboard.updated', listener);

        return () => {
            channel.stopListening('.dashboard.updated');
        };
    }, []);

    return liveTitles;
}
