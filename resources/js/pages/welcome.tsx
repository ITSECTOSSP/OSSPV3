import { Footer2 } from '@/components/footer2';
import PublicLayout from '@/layouts/public-layout';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import GovHero from '@/components/ossp-components/gov-hero';
import BannerCarousel from '@/components/ossp-components/banner-carousel';
import { route } from 'ziggy-js';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const images = Array.from(
        { length: 10 },
        (_, i) => `/banner/${i + 1}.png`
    );

    return (
        <PublicLayout>
            <Head title="Welcome" />

            <div className="flex min-h-screen flex-col">

                {/* 🏛️ 1. HERO (Identity only) */}
                <GovHero />

                {/* 🎞️ 2. FULL BANNER SECTION (VISUAL ONLY) */}
                <section className="relative w-full">

                    <div className="h-[260px] sm:h-[380px] md:h-[520px] lg:h-[720px]">
                        <BannerCarousel images={images} />
                    </div>

                </section>

                {/* 🧾 3. OSSP DIGITAL SYSTEM SECTION (SEPARATE) */}
                <section className="py-16 bg-white dark:bg-[#0a0a0a]">

                    <div className="container mx-auto px-6 text-center max-w-3xl">

                        <h1 className="text-xl md:text-2xl font-bold text-[#16036c] dark:text-white">
                            OSSP Digital System
                        </h1>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Office of the Secretary to the Sangguniang Panlungsod, Quezon City
                        </p>

                        {/* CTA */}
                        <div className="mt-8 flex justify-center">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-[#16036c] px-6 py-3 text-white transition hover:opacity-90"
                                >
                                    Dashboard
                                </Link>
                           ) : (
                                <Link
                                    href={login()}
                                    className="rounded-full bg-[#16036c] px-6 py-3 text-white transition hover:opacity-90"
                                >
                                    Online Proposed Legislative Measure Submission
                                </Link>
                            )}
                        </div>

                    </div>

                </section>

                {/* 🧱 FOOTER */}
                <Footer2 className="bg-white dark:bg-[#0a0a0a]" />

            </div>
        </PublicLayout>
    );
}