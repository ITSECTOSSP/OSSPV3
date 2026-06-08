import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <SidebarGroup className="px-2 py-0">
            {!isCollapsed && (
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
            )}

            <SidebarMenu>
                {items.map((item) => {
                    const Icon = item.icon;

                    // ✅ LABEL (no link, no icon behavior)
                    if (item.isLabel) {
                        return (
                            !isCollapsed && (
                                <div
                                    key={item.title}
                                    className="mt-3 px-2 text-xs font-semibold text-muted-foreground"
                                >
                                    {item.title}
                                </div>
                            )
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={
                                    item.href
                                        ? page.url === item.href
                                        : false
                                }
                            >
                                <Link href={item.href!}>
                                    {Icon && (
                                        <Icon className="mr-2 h-4 w-4" />
                                    )}
                                    {!isCollapsed && item.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}