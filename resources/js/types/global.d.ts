import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare module '@inertiajs/react' {
    interface PageProps extends InertiaPageProps {
        name: string;

        quote: {
            message: string;
            author: string;
        };

        auth: {
            user: {
                id: number;
                employee_number: string;
                role_id: number;
                first_name: string;
                last_name: string;
                middle_name?: string | null;
                full_name: string;
                ossp_sections_id: number;
            } | null;
        };

        session?: {
            lifetime: number;
        };

        flash?: {
            success?: string;
            error?: string;
        };

        sidebarOpen?: boolean;
    }
}