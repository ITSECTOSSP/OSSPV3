import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import { initializeTheme } from './hooks/use-appearance';
import { SharedData } from '@/types';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
   setup({ el, App, props }: { el: HTMLElement; App: any; props: { initialPage: { props: SharedData } } }) {
        const root = createRoot(el);

        const userId = props.initialPage.props.auth?.user?.id ?? 0;

        root.render(
            <StrictMode>
                <App userId={userId} {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
