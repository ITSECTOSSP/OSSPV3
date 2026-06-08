import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    canAccessDocumentTracking,
    canAccessDeptHead,
    canAccessDivisionMonitoring,
} from '@/helpers/access-permission';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    HeartCrack,
    Gavel,
    LayoutGrid,
    ChessKing,
    MonitorCog,
    ChessQueen,
    Grid3X3,
} from 'lucide-react';
import { route } from 'ziggy-js';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

type SidebarProps = {
    auth: {
        user: {
            id: number;
            name: string;
            role_id: number;
            ossp_sections_id: number;
        } | null;
    };
};

export function AppSidebar({ auth }: SidebarProps) {
    const user = auth?.user;
    const role = user?.role_id ?? 0;
    const section = user?.ossp_sections_id ?? 0;

    // =========================
    // GROUPED DOCUMENT TRACKING
    // =========================
    const trackingItems: NavItem[] = [];

    if (canAccessDocumentTracking(role)) {
        trackingItems.push({
            title: 'Tracking Management',
            href: route('document-tracking.index'),
            icon: Grid3X3,
        });
    }

    if (canAccessDeptHead(role)) {
        trackingItems.push({
            title: 'Department Head',
            href: route('depthead.tracking'),
            icon: ChessKing,
        });
    }

    if (canAccessDivisionMonitoring(role, section)) {
        trackingItems.push({
            title: 'Division Monitoring',
            href: route('divchief.tracking'),
            icon: ChessQueen,
        });
    }

    const documentTrackingItems: NavItem[] =
        trackingItems.length > 0
            ? [
                  {
                      title: 'Document Tracking System',
                      isLabel: true,
                  },
                  ...trackingItems,
              ]
            : [];

    // =========================
    // MAIN NAV
    // =========================
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...documentTrackingItems,

        {
            title: 'Legislative Data Tracking System',
            isLabel: true,
        },
        {
            title: 'Proposed Legislation',
            href: route('legislative-tracking.propose.index'),
            icon: Gavel,
        },
        {
            title: 'Approved Legislation',
            href: route('legislative-tracking.approve.index'),
            icon: Gavel,
        },
    ];

    // =========================
    // FOOTER
    // =========================
    const footerNavItems: NavItem[] = [
        ...(role === 1
            ? [
                  {
                      title: 'Admin Panel',
                      href: route('admin-panel.dashboard'),
                      icon: MonitorCog,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}