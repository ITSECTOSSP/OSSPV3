import { AppHeader } from '@/components/app-header';
import BottomUtilityBar from '@/components/ossp-components/control';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader /> {/* reuse header */}
            <main className="flex-1">{children}</main>
            <BottomUtilityBar />
        </div>
    );
}