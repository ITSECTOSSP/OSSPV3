import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrackingTitle } from "@/types/document-tracking";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

type Props = {
    trackingTitles: TrackingTitle[];
    userSectionId: number;
    filterStatus?: number;
};

export default function TrackingCards({
    trackingTitles,
    userSectionId,
    filterStatus,
}: Props) {
    const groupedByStatus: Record<
        number,
        { statusName: string; titles: TrackingTitle[] }
    > = {};

    trackingTitles.forEach((title) => {
        title.assignments?.forEach((assignment) => {
            if (assignment.section?.id !== userSectionId) return;

            const statusId = Number(assignment.status?.id ?? 0);
            if (filterStatus && statusId !== Number(filterStatus)) return;

            const statusName = assignment.status?.status_name ?? "Unknown";

            if (!groupedByStatus[statusId]) {
                groupedByStatus[statusId] = {
                    statusName,
                    titles: [],
                };
            }

            groupedByStatus[statusId].titles.push({
                ...title,
                assignments: [assignment],
            });
        });
    });

    const statusesToRender = Object.values(groupedByStatus);

    const pill = "rounded-full px-2 py-1 text-[11px] font-medium whitespace-nowrap";

    const typeColors: Record<number, string> = {
        1: "bg-amber-100 text-amber-700",
        2: "bg-lime-100 text-lime-700",
        3: "bg-purple-100 text-purple-700",
        4: "bg-orange-100 text-orange-700",
        5: "bg-teal-100 text-teal-700",
        6: "bg-emerald-100 text-emerald-700",
        7: "bg-pink-100 text-pink-700",
    };

    const classificationColors: Record<number, string> = {
        1: "bg-cyan-100 text-cyan-700",
        2: "bg-rose-100 text-rose-700",
        3: "bg-fuchsia-100 text-fuchsia-700",
    };

    return (
        <div className="space-y-10">
            {statusesToRender.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No documents found.
                </p>
            )}

            {statusesToRender.map(({ statusName, titles }) => (
                <section key={statusName} className="space-y-3">
                    {/* STATUS HEADER */}
                    <div className="flex items-center justify-start gap-2">
                        <h2 className="text-base md:text-lg font-semibold tracking-tight">
                            {statusName}
                        </h2>

                        <Badge>
                            {titles.length}
                        </Badge>
                    </div>

                    <Separator />

                    {/* CARDS GRID (mobile-first) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5">
                        {titles.map((tracking) => {
                            const assignment = tracking.assignments?.[0];

                            const typeId = Number(tracking.document_type?.id);
                            const classificationId = Number(
                                tracking.document_classifications?.id,
                            );

                            return (
                                <Link
                                    key={tracking.id}
                                    href={route(
                                        "document-tracking.manage",
                                        tracking.id,
                                    )}
                                    className="group"
                                >
                                    <Card
                                        className="
                                            h-full
                                            border border-muted
                                            bg-white/80
                                            shadow-sm
                                            transition-all duration-200
                                            hover:-translate-y-1
                                            hover:shadow-md
                                        "
                                    >
                                        <CardHeader className="space-y-2 pb-3">
                                            {/* TOP ROW */}
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="text-sm md:text-base leading-snug group-hover:text-primary transition">
                                                    {tracking.titles_dcn}
                                                </CardTitle>

                                                {tracking.document_type && (
                                                    <span
                                                        className={`${pill} ${
                                                            typeColors[typeId] ??
                                                            "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {
                                                            tracking.document_type
                                                                .types_name
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* TITLE */}
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {tracking.titles_title}
                                            </p>
                                        </CardHeader>

                                        <CardContent className="space-y-3 text-sm">
                                            {/* META GRID */}
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                                                <span className="text-muted-foreground">
                                                    From
                                                </span>
                                                <span className="font-medium">
                                                    {tracking.titles_from || "-"}
                                                </span>

                                                <span className="text-muted-foreground">
                                                    Subject
                                                </span>
                                                <span className="font-medium line-clamp-1">
                                                    {tracking.titles_subject ||
                                                        "-"}
                                                </span>
                                            </div>

                                            {/* PILLS ROW */}
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {tracking.document_classifications && (
                                                    <span
                                                        className={`${pill} ${
                                                            classificationColors[
                                                                classificationId
                                                            ] ??
                                                            "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {
                                                            tracking
                                                                .document_classifications
                                                                .classifications_name
                                                        }
                                                    </span>
                                                )} 
                                            </div>

                                            {/* FOOTER INFO */}
                                            <div className="pt-2 text-[11px] text-muted-foreground">
                                                Assigned:{" "}
                                                <span className="font-medium text-foreground">
                                                    {assignment?.created_at
                                                        ? new Date(
                                                              assignment.created_at,
                                                          ).toLocaleString(
                                                              undefined,
                                                              {
                                                                  year: "numeric",
                                                                  month: "short",
                                                                  day: "2-digit",
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                                  hour12: true,
                                                              },
                                                          )
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}