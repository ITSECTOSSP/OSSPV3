import { FileUploader } from '@/components/document-tracking/file-uploader';
import AssignForm from '@/components/document-tracking/forms/ossp-assign-form';
import ReplyForm from '@/components/document-tracking/forms/ossp-reply-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useManageTracking } from '@/hooks/useTrackingManage';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, OsspSections, User } from '@/types';
import {
    DocumentType,
    TrackingClassification,
    TrackingTitle,
} from '@/types/document-tracking';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CircleAlert,
    Info,
    MessageSquare,
    ScrollText,
    UserRoundPen,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { route } from 'ziggy-js';

interface Props {
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
    item: TrackingTitle;
    osspSections: OsspSections[];
}

export default function assignForm({
    item,
    documentTypes,
    trackingClassification,
    osspSections,
}: Props) {
    const { currentUser } = usePage().props as unknown as { currentUser: User };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Document Tracking', href: route('document-tracking.index') },
        {
            title: 'Manage Document',
            href: route('document-tracking.manage', item.id),
        },
    ];

    const liveItem = useManageTracking(item, {
        sectionId: currentUser.ossp_sections_id ?? undefined,
        divisionId: currentUser.section?.ossp_division_id ?? undefined,
    });

    const uploadToken = useRef(uuidv4());

    const { data, setData, put, processing, errors } = useForm({
        titles_dcn: liveItem.titles_dcn,
        titles_title: liveItem.titles_title,
        titles_from: liveItem.titles_from,
        titles_subject: liveItem.titles_subject,
        document_type_id: String(liveItem.document_type_id),
        classifications_id: String(liveItem.classifications_id),
    });

    useEffect(() => {
        setData({
            titles_dcn: liveItem.titles_dcn ?? '',
            titles_title: liveItem.titles_title ?? '',
            titles_from: liveItem.titles_from ?? '',
            titles_subject: liveItem.titles_subject ?? '',
            document_type_id: String(liveItem.document_type_id ?? ''),
            classifications_id: String(liveItem.classifications_id ?? ''),
        });
    }, [liveItem]);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(data);
        put(route('document-tracking.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Document" />
            <div className="relative flex-1 gap-2 overflow-hidden border border-sidebar-border/70 p-3">
                <div className="align-self-center m-4 mx-auto w-full justify-self-center rounded-xl border p-4 md:mx-auto md:my-6 md:w-7/9">
                    {/*Display Errors */}

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                <ul className="ml-5 list-disc">
                                    {Object.entries(errors).map(
                                        ([key, message]) => (
                                            <li key={key}>
                                                {message as string}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="relative mb-4 flex items-center">
                        {/* Back button */}
                        <Link
                            onClick={() => window.history.back()}
                            className="z-10 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        {/* Centered title */}
                        <h2 className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
                            <BookOpen className="h-7 w-7 text-primary" />
                            Manage DCN
                        </h2>
                    </div>

                    <Separator className="align-self-start m-3 w-[500px]" />

                    <Tabs orientation="vertical" defaultValue="details">
                        <TabsList className="grid min-w-[300px] grid-cols-4">
                            <TabsTrigger value="details">
                                <Info className="h-7 w-7 text-primary" />
                                Details
                            </TabsTrigger>

                            <TabsTrigger value="files">
                                <ScrollText className="h-7 w-7 text-primary" />
                                Files
                            </TabsTrigger>

                            <TabsTrigger value="assign">
                                <UserRoundPen className="h-7 w-7 text-primary" />
                                Assign
                            </TabsTrigger>

                            <TabsTrigger value="reply">
                                <MessageSquare className="h-7 w-7 text-primary" />
                                Reply
                            </TabsTrigger>
                        </TabsList>

                        {/* ================= DETAILS FORM ================= */}
                        <TabsContent value="details" className="m-3">
                            <form
                                onSubmit={handleUpdate}
                                className="space-y-4"
                                action=""
                            >
                                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                                    <div className="flex flex-1 flex-col">
                                        {/* Control Number */}
                                        <FieldGroup>
                                            <Field data-disabled>
                                                <FieldLabel htmlFor="titles_dcn">
                                                    Control Number
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        disabled
                                                        id="titles_dcn"
                                                        placeholder="Enter Control Number"
                                                        value={data.titles_dcn}
                                                        onChange={(e) =>
                                                            setData(
                                                                'titles_dcn',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </FieldContent>
                                                <FieldError />
                                            </Field>

                                            {/* From */}
                                            <Field data-disabled>
                                                <FieldLabel htmlFor="titles_from">
                                                    From
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        disabled
                                                        id="titles_from"
                                                        placeholder="Enter From"
                                                        value={data.titles_from}
                                                        onChange={(e) =>
                                                            setData(
                                                                'titles_from',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </FieldContent>
                                                <FieldError />
                                            </Field>
                                        </FieldGroup>

                                        {/* Subject */}
                                        <Field data-disabled>
                                            <FieldLabel htmlFor="titles_subject">
                                                Subject
                                            </FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    disabled
                                                    id="titles_subject"
                                                    placeholder="Enter Subject"
                                                    value={data.titles_subject}
                                                    onChange={(e) =>
                                                        setData(
                                                            'titles_subject',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </FieldContent>
                                            <FieldError />
                                        </Field>
                                        
                                    </div>

                                    <div className="flex flex-1 flex-col gap-7">
                                        {/* Document Type */}
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel>Type</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        disabled
                                                        value={
                                                            data.document_type_id
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'document_type_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Document Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>
                                                                    Types
                                                                </SelectLabel>
                                                                {documentTypes.map(
                                                                    (type) => (
                                                                        <SelectItem
                                                                            key={
                                                                                type.id
                                                                            }
                                                                            value={String(
                                                                                type.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                type.types_name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                                <FieldError />
                                            </Field>
                                        </FieldGroup>

                                        {/* Document Classification */}
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel>
                                                    Classification
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        disabled
                                                        value={
                                                            data.classifications_id
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'classifications_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Document Classification" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>
                                                                    Classifications
                                                                </SelectLabel>
                                                                {trackingClassification.map(
                                                                    (type) => (
                                                                        <SelectItem
                                                                            key={
                                                                                type.id
                                                                            }
                                                                            value={String(
                                                                                type.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                type.classifications_name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                                <FieldError />
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                                <FieldGroup>
                                    <Field data-disable>
                                        <FieldLabel>Title</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                disabled
                                                placeholder="Enter Document Title"
                                                value={data.titles_title}
                                                onChange={(e) =>
                                                    setData(
                                                        'titles_title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </FieldContent>
                                        <FieldError />
                                    </Field>
                                </FieldGroup>
                            </form>
                        </TabsContent>

                        {/* ================= Upload File FORM ================= */}
                        <TabsContent value="files" className="m-3">
                            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                                <FileUploader
                                    canUpload={liveItem.can_upload ?? false}
                                    uploadToken={uploadToken.current}
                                    existingFiles={liveItem.files} // <-- use liveItem
                                    trackingTitlesId={liveItem.id}
                                />
                            </div>
                        </TabsContent>

                        {/* ================= ASSIGN FORM ================= */}
                        <TabsContent value="assign" className="m-3">
                            <AssignForm
                                trackingTitleId={liveItem.id}
                                osspSections={osspSections}
                                item={liveItem}
                                currentUser={currentUser}
                            />
                        </TabsContent>

                        {/* ================= REPLY FORM ================= */}
                        <TabsContent value="reply" className="m-3">
                            <ReplyForm
                                trackingTitleId={liveItem.id}
                                replies={liveItem.replies} // MUST come from useManageTracking
                                currentUser={currentUser}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
