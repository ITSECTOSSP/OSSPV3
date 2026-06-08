import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TrackingFile } from '@/types/document-tracking';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
    Eye,
    FileAudio,
    FileIcon,
    FileImage,
    FileText,
    Plus,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '../ui/button';

type FileWithProgress = {
    id: string;
    file: File;
    progress: number;
    uploaded: boolean;
};

interface Props {
    uploadToken: string;
    existingFiles?: TrackingFile[];
    trackingTitlesId?: number;
    canUpload?: boolean;
}

export function FileUploader({
    uploadToken,
    existingFiles = [],
    trackingTitlesId,
    canUpload = true,
}: Props) {
    const [existingFilesState, setExistingFiles] =
        useState<TrackingFile[]>(existingFiles);

    const [fileToDelete, setFileToDelete] = useState<TrackingFile | null>(null);
    const [files, setFiles] = useState<FileWithProgress[]>([]);
    const [uploading, setUploading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // ✅ Sync with hook updates
    useEffect(() => {
        setExistingFiles(existingFiles);
    }, [existingFiles]);

    // Existing effect
    useEffect(() => {
        if (files.length > 0 && files.every((f) => f.uploaded)) {
            setFiles([]);
        }
    }, [files]);

    function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) {
            return;
        }
        const newFiles = Array.from(e.target.files).map((file) => ({
            id: file.name,
            file,
            progress: 0,
            uploaded: false,
        }));

        setFiles([...files, ...newFiles]);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    async function handleUpload() {
        if (files.length === 0 || uploading) return;

        setUploading(true);

        const uploadPromises = files.map(async (fileWithProgress) => {
            const formData = new FormData();
            formData.append('file', fileWithProgress.file);

            if (trackingTitlesId) {
                formData.append('tracking_titles_id', String(trackingTitlesId));
            } else if (uploadToken) {
                formData.append('upload_token', uploadToken);
            } else {
                console.error('No trackingTitlesId or uploadToken provided!');
            }

            try {
                // Send file to backend
                const response = await axios.post(
                    route('document-tracking.files.upload'),
                    formData,
                    {
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) /
                                    (progressEvent.total || 1),
                            );

                            setFiles((prevFiles) =>
                                prevFiles.map((file) =>
                                    file.id === fileWithProgress.id
                                        ? { ...file, progress }
                                        : file,
                                ),
                            );
                        },
                    },
                );

                const savedFile: TrackingFile = response.data;

                // ✅ Mark this file as uploaded
                setFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.id === fileWithProgress.id
                            ? { ...file, uploaded: true }
                            : file,
                    ),
                );

                // ✅ Add to existingFiles only from backend
                setExistingFiles((prev) => [
                    ...prev.filter((f) => f.id !== savedFile.id),
                    savedFile,
                ]);
            } catch (error) {
                console.error(error);
            }
        });

        await Promise.all(uploadPromises);
        setUploading(false);
    }

    function DeleteFileDialog({
        file,
        onCancel,
        onConfirm,
    }: {
        file: TrackingFile;
        onCancel: () => void;
        onConfirm: () => void;
    }) {
        return (
            <Dialog open={true} onOpenChange={onCancel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete File</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{file.tfiles_original_name}</strong>?
                            <br />
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={onConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    function removeFile(id: string) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }

    function handleClear() {
        setFiles([]);
    }

    return (
        <div className="flex w-full flex-col gap-2">
            {canUpload && (
                <div className="m-2 my-4">
                    <h2 className="text-l font-bold">File Upload</h2>
                    <div className="flex w-full flex-col gap-4 lg:flex-row">
                        <FileInput
                            inputRef={inputRef}
                            disabled={uploading}
                            onFileSelect={handleFileSelect}
                        />
                        <ActionButtons
                            disabled={files.length === 0 || uploading}
                            onUpload={handleUpload}
                            onClear={handleClear}
                        />
                    </div>
                </div>
            )}
            <ExistingFileList
                files={existingFilesState}
                onDelete={(file) => setFileToDelete(file)}
            />
            <FileList
                files={files}
                onRemove={removeFile}
                uploading={uploading}
            />
            {fileToDelete && (
                <DeleteFileDialog
                    file={fileToDelete}
                    onCancel={() => setFileToDelete(null)}
                    onConfirm={() => {
                        router.delete(
                            route(
                                'document-tracking.files.destroy',
                                fileToDelete.id,
                            ),
                            {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    setExistingFiles((prev) =>
                                        prev.filter(
                                            (f) => f.id !== fileToDelete.id,
                                        ),
                                    );
                                    setFileToDelete(null);
                                },
                            },
                        );
                    }}
                />
            )}
        </div>
    );
}

type FileInputProps = {
    inputRef: React.RefObject<HTMLInputElement | null>;
    disabled: boolean;
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FileInput({ inputRef, disabled, onFileSelect }: FileInputProps) {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <input
                type="file"
                ref={inputRef}
                onChange={onFileSelect}
                multiple
                className="hidden"
                id="file-upload"
                disabled={disabled}
            />
            <label
                htmlFor="file-upload"
                className="bg-grayscale-700 flex cursor-pointer items-center gap-2 rounded-md py-2 hover:opacity-90"
            >
                <Plus size={18} />
                Select Files
            </label>
        </div>
    );
}

type ActionButtonsProps = {
    onUpload: () => void;
    onClear: () => void;
    disabled: boolean;
};

function ActionButtons({ onUpload, onClear, disabled }: ActionButtonsProps) {
    return (
        <>
            <Button
                type="button"
                onClick={onUpload}
                disabled={disabled}
                className="mb-2 flex w-30 items-center gap-2 md:mb-0"
            >
                <Upload size={18} />
                Upload
            </Button>
            <Button
                type="button"
                onClick={onClear}
                className="mb-2 flex w-30 items-center gap-2 md:mb-0"
                disabled={disabled}
            >
                <Trash2 size={18} />
                Clear All
            </Button>
        </>
    );
}

type FileListProps = {
    files: FileWithProgress[];
    onRemove: (id: string) => void;
    uploading: boolean;
};

function FileList({ files, onRemove, uploading }: FileListProps) {
    if (files.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <h3 className="font-semibold">Files:</h3>
            <div className="space-y-2">
                {files.map((file) => (
                    <FileItem
                        key={file.id}
                        file={file}
                        onRemove={onRemove}
                        uploading={uploading}
                    />
                ))}
            </div>
        </div>
    );
}

type FileItemProps = {
    file: FileWithProgress;
    onRemove: (id: string) => void;
    uploading: boolean;
};

function FileItem({ file, onRemove, uploading }: FileItemProps) {
    const Icon = getFileIcon(file.file.type);

    return (
        <div className="bg-grayscale-700 space-y-2 rounded-md p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Icon
                        size={40}
                        className="text-primary-500 hidden md:flex"
                    />
                    <div className="flex flex-col">
                        <span className="font-medium">{file.file.name}</span>
                        <div className="text-grayscale-400 flex items-center gap-2 text-xs">
                            <span>{formatFileSize(file.file.size)}</span>
                            <span>•</span>
                            <span>{file.file.type || 'Unknown type'}</span>
                        </div>
                    </div>
                </div>
                {!uploading && (
                    <Button
                        type="button"
                        onClick={() => onRemove(file.id)}
                        className="bg-none"
                    >
                        <X size={16} className="text-white" />
                    </Button>
                )}
            </div>
            <div className="text-right text-xs">
                {file.uploaded ? 'Completed' : `${Math.round(file.progress)}%`}
            </div>
            <ProgressBar progress={file.progress} />
        </div>
    );
}

type ProgressBarProps = {
    progress: number;
};

function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="bg-grayscale-800 h-2 w-full overflow-hidden rounded-full">
            <div
                className="bg-primary-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('audio/')) return FileAudio;
    if (mimeType === 'application/pdf') return FileText;
    return FileIcon;
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

function ExistingFileList({
    files,
    onDelete,
}: {
    files: TrackingFile[];
    onDelete: (file: TrackingFile) => void;
}) {
    return (
        <div className="space-y-2">
            <h3 className="font-semibold">Uploaded Files</h3>

            {!files || files.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                    No Files Uploaded
                </p>
            ) : (
                files.map((file) => {
                    const Icon = getFileIcon(file.tfiles_mime_type);

                    return (
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <Icon size={32} />
                                <div className="min-w-0">
                                    {/* Filename */}
                                    <p
                                        className="truncate font-medium"
                                        title={file.tfiles_original_name}
                                    >
                                        {file.tfiles_original_name}
                                    </p>

                                    {/* File info */}
                                    <div className="space-y-1 truncate text-xs text-muted-foreground">
                                        <p className="truncate">
                                            {formatFileSize(
                                                file.tfiles_file_size,
                                            )}
                                        </p>

                                        {file.uploader && (
                                            <p className="truncate">
                                                Uploaded by:{' '}
                                                <strong>
                                                    {file.uploader.full_name}
                                                </strong>{' '}
                                                on:{' '}
                                                <strong>
                                                    {new Date(
                                                        file.created_at,
                                                    ).toLocaleString()}
                                                </strong>
                                            </p>
                                        )}

                                        {file.section && (
                                            <p className="truncate">
                                                Section:{' '}
                                                <strong>
                                                    {file.section.sections_name}
                                                </strong>
                                            </p>
                                        )}

                                        {file.tfiles_page_count && (
                                            <p className="truncate">
                                                Pages:{' '}
                                                <strong>
                                                    {file.tfiles_page_count}
                                                </strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-shrink-0 flex-col-reverse items-center gap-1">
                                <a
                                    className="rounded bg-secondary p-2 text-primary hover:bg-primary hover:text-secondary"
                                    href={file.tfiles_file_path}
                                    target="_blank"
                                >
                                    <Eye />
                                </a>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => onDelete(file)}
                                >
                                    <Trash2 size={16} className="text-white" />
                                </Button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
