import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    isLabel?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;

    quote: {
        message: string;
        author: string;
    };

    auth: Auth;

    sidebarOpen?: boolean;

    session?: {
        lifetime: number;
    };

    flash?: {
        success?: string;
        error?: string;
    };

    [key: string]: unknown;
}

export interface UserRole {
    id: number;
    name: string;
}

export interface OsspSections {
    id: number;
    sections_name: string;

    ossp_division_id?: number | null;
    division?: OsspDivisions;
}

export interface OsspDivisions {
    id: number;
    divisions_names: string;
}

export interface User {
    id: number;

    employee_number: string;

    first_name: string;

    middle_name: string;

    last_name: string;

    full_name: string;

    email: string;

    avatar?: string;

    email_verified_at: string | null;

    two_factor_enabled?: boolean;

    role_id: number;

    ossp_sections_id: number;

    role?: UserRole;

    section?: OsspSections;

    created_at: string;

    updated_at: string;
}

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];

    current_page: number;

    last_page: number;

    per_page: number;

    total: number;

    from: number | null;

    to: number | null;

    links: PaginationLink[];
};