import { OsspDivisions, OsspSections } from '@/types';

export interface Assignment {
    id: number;
    assigned_remarks?: string | null;
    section: {
        id: number;
        sections_name: string;
        ossp_division_id: number; // now available
        division?: OsspDivisions;
    };
    status: { id: number; status_name: string };
    created_at: string;
    status_2_date: string;
    status_3_date: string;
    creator?: { id: number; name: string } | null;
}

export interface TrackingFile {
    id: number;
    tfiles_original_name: string;
    tfiles_file_path: string;
    tfiles_mime_type: string;
    tfiles_file_size: number;
    tracking_titles_id: number;
    created_at: string;

    uploader?: {
        id: number;
        full_name: string;
    };
    section?: {
        id: number;
        sections_name: string;
    };

    tfiles_page_count: number;
}

export interface TrackingTitle {
    id: number;
    titles_dcn: string;
    titles_title: string;
    titles_from: string;
    titles_subject: string;
    document_type_id: string;
    classifications_id: string;
    categories_id: string;
    notify_depthead: boolean;
    assignments: Assignment[];
    files: TrackingFile[];
    replies: Reply[];
    created_at: string;
    updated_at: string;
    can_upload?: boolean;

    creator?: {
        id: number;
        full_name: string;
    };

    editor?: {
        id: number;
        full_name: string;
    };

    document_type: {
        id: number;
        types_name: string;
    };

    document_classifications: {
        id: number;
        classifications_name: string;
    };

    document_categories: {
        id: number;
        categories_name: string;
    };
}

type DocumentType = {
    id: number;
    types_name: string;
    created_at?: string;
    updated_at?: string;
};

type TrackingClassification = {
    id: number;
    classifications_name: string;
    created_at?: string;
    updated_at?: string;
};

interface AssignFormProps {
    trackingTitleId: number;
    osspSections: OsspSections[];
    item: TrackingTitle; // ✅ add this
}

type ActionTaken = {
    id: number;
    action_taken_text: string;
    created_at: string;
    creator?: {
        full_name: string;
    };
};

export interface Reply {
    id: number;
    reply_remarks: string;
    created_at: string;
    actions_taken?: ActionTaken[];
    creator: {
        id: number;
        full_name: string;
    };
    section: {
        sections_name: string;
    };
}
