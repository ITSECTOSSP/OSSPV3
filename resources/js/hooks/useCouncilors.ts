import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LegislativeCityCouncilor } from '@/types/legislative-tracking';

export function useCouncilors(councilIds: string[] = []) {
    const [councilors, setCouncilors] = useState<LegislativeCityCouncilor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!councilIds.length) {
            setCouncilors([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                const { data } = await api.get('/legislative/councilors', {
                    params: {
                        city_council_ids: councilIds,
                    },
                });

                setCouncilors(data ?? []);
            } catch (error) {
                console.error(error);
                setCouncilors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [JSON.stringify(councilIds)]);

    return { councilors, loading };
}