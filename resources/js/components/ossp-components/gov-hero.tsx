import { useEffect, useState } from 'react';

interface GovHeroProps {
    logo?: string;
    office?: string;
    description?: string;
}

const GovHero = ({
    logo = '/ossp_logo.png',
    office = 'Office of the Secretary to the Sangguniang Panlungsod',
    description = 'Quezon City Government',
}: GovHeroProps) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            const formatted = new Intl.DateTimeFormat('en-PH', {
                timeZone: 'Asia/Manila',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }).format(now);

            setTime(formatted);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-10 md:py-4">
            <div className="container mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* LEFT */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <img
                            src={logo}
                            alt="Government Logo"
                            className="mb-6 h-24 object-contain md:h-28"
                        />

                        {/* OFFICE NAME */}
                        <h1 className="text-lg leading-tight font-semibold text-[#16036c] md:text-xl dark:text-white">
                            {office}
                        </h1>

                        {/* DESCRIPTION */}
                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="glass w-full max-w-md rounded-2xl px-8 py-8 text-center lg:text-right">
                            {/* TIME LABEL */}
                            <div className="text-xs font-medium text-muted-foreground">
                                Philippine Standard Time
                            </div>

                            {/* TIME VALUE */}
                            <div className="mt-1 font-mono text-sm text-foreground md:text-base">
                                {time}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GovHero;
