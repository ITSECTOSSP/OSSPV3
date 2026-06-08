import * as React from 'react';

export default function BottomUtilityBar() {
    const [dark, setDark] = React.useState(
        () => document.documentElement.classList.contains('dark')
    );

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleTheme = () => {
        const root = document.documentElement;

        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            setDark(false);
        } else {
            root.classList.add('dark');
            setDark(true);
        }
    };

    return (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">

            {/* BAR */}
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">

                {/* Scroll to top */}
                <button
                    onClick={scrollTop}
                    className="rounded-full px-3 py-1 text-sm font-medium text-[#16036c] transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                    ↑ Top
                </button>

                {/* Divider */}
                <div className="h-5 w-px bg-border" />

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="rounded-full px-3 py-1 text-sm font-medium text-[#16036c] transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                    {dark ? '☀️ Light' : '🌙 Dark'}
                </button>

            </div>

        </div>
    );
}