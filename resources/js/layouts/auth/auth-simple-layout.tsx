import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative min-h-screen w-full">

            {/* Optional Top Logo */}
            <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2">
                <Link
                    href={home()}
                    className="flex flex-col items-center gap-2 font-medium"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md">
                        <AppLogoIcon className="size-12 fill-current text-white" />
                    </div>
                    <span className="sr-only">{title}</span>
                </Link>
            </div>

            {/* Page Content */}
            {children}

        </div>
    );
}