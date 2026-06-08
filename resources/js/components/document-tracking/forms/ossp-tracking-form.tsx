import { FileUploader } from '@/components/document-tracking/file-uploader';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    DocumentType,
    TrackingClassification,
    TrackingFile,
} from '@/types/document-tracking';

type TrackingTitleFormData = {
    titles_dcn: string;
    titles_from: string;
    titles_subject: string;
    titles_title: string;
    document_type_id: string;
    classifications_id: string;
    upload_token: string;
};

type TrackingTitleFormProps = {
    data: TrackingTitleFormData;
    setData: (key: keyof TrackingTitleFormData, value: any) => void;
    uploadToken: string;
    documentTypes: DocumentType[];
    trackingClassification: TrackingClassification[];
    processing: boolean;
    errors: Partial<Record<keyof TrackingTitleFormData, string>>;
    onSubmit: (e: React.FormEvent) => void;
    item?: {
        id: number;
    };
    files?: TrackingFile[];
};

export default function TrackingTitleForm({
    data,
    item,
    files,
    setData,
    uploadToken,
    documentTypes,
    trackingClassification,
    processing,
    errors,
    onSubmit,
}: TrackingTitleFormProps) {
    const inputClass = (field: keyof TrackingTitleFormData) =>
        `w-full rounded px-3 py-2 border ${
            errors[field]
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
        } transition-colors bg-transparent`;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                {/* DCN LEFT */}
                <div className="flex flex-1 flex-col space-y-4">
                    <Field>
                        <FieldLabel>DOCUMENT CONTROL NUMBER</FieldLabel>
                        <FieldContent>
                            <Input
                                value={data.titles_dcn}
                                onChange={(e) =>
                                    setData('titles_dcn', e.target.value)
                                }
                                className={inputClass('titles_dcn')}
                            />
                        </FieldContent>
                        {errors.titles_dcn && (
                            <FieldError>DCN is required</FieldError>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>FROM</FieldLabel>
                        <FieldContent>
                            <Input
                                value={data.titles_from}
                                onChange={(e) =>
                                    setData('titles_from', e.target.value)
                                }
                                className={inputClass('titles_from')}
                            />
                        </FieldContent>
                    </Field>
                    {/*SUBJECT*/}
                    <Field>
                        <FieldLabel>SUBJECT</FieldLabel>
                        <FieldContent>
                            <Input
                                value={data.titles_subject}
                                onChange={(e) =>
                                    setData('titles_subject', e.target.value)
                                }
                                className={inputClass('titles_subject')}
                            />
                        </FieldContent>
                    </Field>
                </div>

                {/* DOCUMENT TYPE "RIGHT" */}
                <div className="flex flex-1 flex-col space-y-4">
                    <Field>
                        <FieldLabel>DOCUMENT TYPE</FieldLabel>
                        <FieldContent>
                            <Select
                                value={data.document_type_id}
                                onValueChange={(value) =>
                                    setData('document_type_id', value)
                                }
                            >
                                <SelectTrigger
                                    className={inputClass('document_type_id')}
                                >
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={String(type.id)}
                                        >
                                            {type.types_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                        {errors.document_type_id && (
                            <FieldError>
                                Select at least one(1) Document Type
                            </FieldError>
                        )}
                    </Field>
                    {/*CLASSIFICATION*/}
                    <Field>
                        <FieldLabel>CLASSIFICATION</FieldLabel>
                        <FieldContent>
                            <Select
                                value={data.classifications_id}
                                onValueChange={(value) =>
                                    setData('classifications_id', value)
                                }
                            >
                                <SelectTrigger
                                    className={inputClass('classifications_id')}
                                >
                                    <SelectValue placeholder="Select Classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    {trackingClassification.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.classifications_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                        {errors.classifications_id && (
                            <FieldError>
                                Select at least one (1) Classification
                            </FieldError>
                        )}
                    </Field>
                </div>
            </div>
            {/*TITLE*/}
            <Field>
                <FieldLabel>TITLE</FieldLabel>
                <FieldContent>
                    <Textarea
                        value={data.titles_title}
                        onChange={(e) =>
                            setData('titles_title', e.target.value)
                        }
                        className={inputClass('titles_title')}
                    />
                </FieldContent>
                {errors.titles_title && (
                    <FieldError>Document Title is required</FieldError>
                )}
            </Field>

            {/* FILE UPLOAD */}
            <Field>
                <FieldLabel>Attach Files</FieldLabel>
                <FieldContent>
                    <FileUploader
                        uploadToken={uploadToken}
                        existingFiles={files || []} 
                        trackingTitlesId={item?.id} 
                        canUpload
                    />
                </FieldContent>
            </Field>

            <Button type="submit" disabled={processing}>
                {processing
                    ? 'Saving...'
                    : item?.id
                      ? 'Update Document Tracking'
                      : 'Create Document Tracking'}
            </Button>
        </form>
    );
}
