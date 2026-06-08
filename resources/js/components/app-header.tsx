import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn, isSameUrl } from '@/lib/utils';
import { login } from '@/routes';
import { type BreadcrumbItem, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLogoIcon from './app-logo-icon';

export function AppHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItem[];
}) {
    const page = usePage();

    const mainNavItems: NavItem[] = [
        { title: 'Home', href: '/' },
        {
            title: 'QC City Council',
            children: [
                {
                    title: 'City Councilors',
                    href: '/services/city-council',
                },
                {
                    title: 'Order of Business',
                    href: '/oob',
                },
                {
                    title: 'Committees',
                    href: '/committees',
                },
            ],
        },
        {
            title: 'OSSP',
            children: [
                {
                    title: 'Secretary to the Sanggunian',
                    href: '/services/secretary-to-the-sanggunian',
                },
                {
                    title: 'About',
                    href: '/about',
                },
                {
                    title: 'Contact us',
                    href: '/contact',
                },
            ],
        },
        {
            title: 'Services',
            children: [
                {
                    title: 'Document Tracking',
                    href: '/services/document-tracking',
                },
                {
                    title: 'Legislative Tracking',
                    href: '/services/legislative-tracking',
                },
            ],
        },
    ];

    const isItemActive = (item: NavItem) => {
        if (item.href && isSameUrl(page.url, item.href)) return true;
        if (item.children) {
            return item.children.some((c) => isSameUrl(page.url, c.href));
        }
        return false;
    };

    // -----------------------------
    // SCROLL STATE
    // -----------------------------
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // -----------------------------
    // THEME TOKENS (SINGLE SOURCE)
    // -----------------------------
    const theme = {
        text: isScrolled ? 'text-white' : 'text-[#16036c] dark:text-white',

        mutedText: isScrolled
            ? 'text-white/70'
            : 'text-[#16036c]/70 dark:text-white/70',

        hoverBg: isScrolled
            ? 'hover:bg-white/10'
            : 'hover:bg-[#16036c]/10 dark:hover:bg-white/10',

        underline: isScrolled
            ? 'after:bg-white'
            : 'after:bg-[#16036c] dark:after:bg-white',

        button: {
            base: 'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 shadow-md',

            primary: isScrolled
                ? 'bg-white text-[#16036c] hover:bg-white/90'
                : 'bg-[#16036c] text-white hover:bg-[#12024d] dark:bg-white dark:text-[#16036c] dark:hover:bg-white/90',
        },

        dropdown: isScrolled
            ? 'bg-[#0b0b2a]/90 text-white border border-white/10 backdrop-blur-xl'
            : 'bg-white text-[#16036c] dark:bg-[#0b0b2a]/90 dark:text-white dark:border-white/10',
    };

    const navItemBase = cn(
        'relative flex items-center rounded-md px-3 py-2 text-sm transition',
        'bg-transparent hover:bg-transparent', // 🔥 kills white background
    );

    // -----------------------------
    // INTENT HOVER STATE
    // -----------------------------
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const openTimeout = useRef<NodeJS.Timeout | null>(null);
    const closeTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleOpen = (i: number) => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        openTimeout.current = setTimeout(() => setOpenIndex(i), 120);
    };

    const handleClose = () => {
        if (openTimeout.current) clearTimeout(openTimeout.current);
        closeTimeout.current = setTimeout(() => setOpenIndex(null), 180);
    };

    return (
        <>
            {/* NAVBAR */}
            <div
                className={cn(
                    'sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300',
                    isScrolled
                        ? 'border-white/10 bg-[#16036c] shadow-md'
                        : 'border-[#16036c]/10 bg-white/90 dark:bg-black/60',
                )}
            >
                <div className="relative mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* MOBILE */}
                    <div className="absolute left-4 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className={theme.text} />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="left" className="w-72 p-0">
                                <SheetTitle className="sr-only">
                                    Menu
                                </SheetTitle>

                                <div className="flex items-center gap-3 border-b p-4">
                                    <AppLogoIcon
                                        className={cn('h-8 w-8', theme.text)}
                                    />
                                    <span
                                        className={cn(
                                            'hidden text-sm font-semibold sm:block',
                                            theme.text,
                                        )}
                                    >
                                        OSSP Digital System
                                    </span>
                                </div>

                                <div className="space-y-2 p-4">
                                    {mainNavItems.map((item, i) =>
                                        item.children ? (
                                            <div key={i}>
                                                <p
                                                    className={cn(
                                                        'mb-2 text-xs font-semibold uppercase',
                                                        theme.mutedText,
                                                    )}
                                                >
                                                    {item.title}
                                                </p>

                                                {item.children.map(
                                                    (child, j) => (
                                                        <Link
                                                            key={j}
                                                            href={child.href}
                                                            className={cn(
                                                                'block rounded-md px-3 py-2 text-sm transition',
                                                                theme.hoverBg,
                                                                isSameUrl(
                                                                    page.url,
                                                                    child.href,
                                                                ) &&
                                                                    'bg-[#16036c]/10 font-semibold',
                                                            )}
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                key={i}
                                                href={item.href}
                                                className={cn(
                                                    'block rounded-md px-3 py-2 text-sm transition',
                                                    theme.hoverBg,
                                                    isItemActive(item) &&
                                                        'bg-[#16036c]/10 font-semibold',
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        ),
                                    )}
                                </div>

                                <div className="border-t p-4">
                                    <Link
                                        className={cn(
                                            theme.button.base,
                                            theme.button.primary,
                                        )}
                                        href={login()}
                                    >
                                        Login
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* LOGO */}
                    <div className="flex w-full justify-center lg:w-auto lg:justify-start">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoIcon
                                className={cn('h-8 w-8', theme.text)}
                            />
                            <span
                                className={cn(
                                    'hidden text-sm font-semibold sm:block',
                                    theme.text,
                                )}
                            >
                                OSSP Digital System
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP NAV */}
                    <div className="hidden flex-1 justify-center lg:flex">
                        <NavigationMenu>
                            <NavigationMenuList className="flex items-center gap-2">
                                {mainNavItems.map((item, i) => (
                                    <NavigationMenuItem key={i}>
                                        {item.children ? (
                                            <div
                                                className="relative px-2"
                                                onMouseEnter={() =>
                                                    handleOpen(i)
                                                }
                                                onMouseLeave={handleClose}
                                            >
                                                <button
                                                    className={cn(
                                                        navItemBase,
                                                        theme.text,
                                                        theme.hoverBg,
                                                    )}
                                                >
                                                    {item.title}
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-4 w-4 transition-transform',
                                                            openIndex === i &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>

                                                <div
                                                    onMouseEnter={() =>
                                                        handleOpen(i)
                                                    }
                                                    onMouseLeave={handleClose}
                                                    className={cn(
                                                        'absolute top-full left-0 mt-2 w-56 rounded-xl p-2 shadow-xl transition-all duration-200',
                                                        theme.dropdown,
                                                        openIndex === i
                                                            ? 'visible translate-y-0 opacity-100'
                                                            : 'invisible translate-y-2 opacity-0',
                                                    )}
                                                >
                                                    {item.children.map(
                                                        (child, j) => (
                                                            <Link
                                                                key={j}
                                                                href={
                                                                    child.href
                                                                }
                                                                className={cn(
                                                                    'relative block rounded-md px-3 py-2 text-sm transition',
                                                                    theme.hoverBg,
                                                                    'after:absolute after:bottom-1 after:left-3 after:h-[2px] after:w-0 after:transition-all hover:after:w-[70%]',
                                                                    theme.underline,
                                                                    isSameUrl(
                                                                        page.url,
                                                                        child.href,
                                                                    ) &&
                                                                        'font-semibold',
                                                                )}
                                                            >
                                                                {child.title}
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navItemBase,
                                                    theme.text,
                                                    theme.hoverBg,
                                                    'relative transition',
                                                    theme.text,
                                                    'after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:transition-all hover:after:w-[70%]',
                                                    theme.underline,
                                                    isSameUrl(
                                                        page.url,
                                                        item.href,
                                                    ) &&
                                                        'font-semibold after:w-[70%]',
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* LOGIN */}
                    <div className="absolute right-4 hidden lg:flex">
                        <Link
                            className={cn(
                                theme.button.base,
                                theme.button.primary,
                            )}
                            href={login()}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* BREADCRUMBS */}
            {breadcrumbs.length > 1 && (
                <div className="border-b bg-white/60 backdrop-blur dark:bg-black/30">
                    <div className="mx-auto flex h-12 items-center px-4 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
