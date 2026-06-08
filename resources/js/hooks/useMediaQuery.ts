// resources/js/hooks/use-media-query.ts

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
    const getMatches = (query: string): boolean => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }

        return false;
    };

    const [matches, setMatches] = useState(getMatches(query));

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        const handler = () => setMatches(mediaQuery.matches);

        handler();

        mediaQuery.addEventListener('change', handler);

        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    }, [query]);

    return matches;
}