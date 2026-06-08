import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {

    const pageProps = usePage().props as unknown as {
        auth: {
            user: {
                id: number;
                name: string;
                role_id: number;
                ossp_sections_id: number;
            } | null;
        };
    };

    return (
        <AppShell variant="sidebar">
            <AppSidebar auth={pageProps.auth} />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}