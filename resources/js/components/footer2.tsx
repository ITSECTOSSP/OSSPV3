import { cn } from '@/lib/utils';

interface FooterLink {
    name: string;
    href: string;
}
interface FooterSection {
    title: string;
    links: FooterLink[];
}
interface FooterLogo {
    url: string;
    src: string;
    alt: string;
    title: string;
}

interface FooterBasicProps {
    logo?: FooterLogo;
    description?: string;
    sections?: FooterSection[];
    copyright?: string;
    legalLinks?: FooterLink[];
    className?: string;
}

type Props = Partial<FooterBasicProps>;

const defaultProps: FooterBasicProps = {
    logo: {
        url: '/',
        src: '/ossp_logo.png',
        alt: 'OSSP Logo',
        title: 'OSSP',
    },
    description:
        'Office of the Secretary to the Sangguniang Panlungsod, Quezon City.',
    sections: [
        {
            title: 'Legislation',
            links: [
                { name: 'Proposed Legislative', href: '#' },
                { name: '23rd City Council', href: '#' },
                { name: 'Order of Business', href: '#' },
                { name: 'Committees', href: '#' },
            ],
        },
        {
            title: 'OSSP',
            links: [
                { name: 'About', href: '#' },
                { name: 'Secretary to the Sanggunian', href: '#' },
                { name: 'Contact us', href: '#' },
                { name: 'Careers', href: '#' },
            ],
        },
        {
            title: 'Support',
            links: [
                { name: 'FAQs', href: '#' },
                { name: 'Documentation', href: '#' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'City Ordinances', href: '#' },
                { name: 'City Resolutions', href: '#' },
                { name: 'Codified Laws', href: '#' },
            ],
        },
    ],
    copyright:
        '© 2026 Quezon City Government. All rights reserved.',
    legalLinks: [
        { name: 'Terms and Conditions', href: '#' },
        { name: 'Privacy Policy', href: '#' },
    ],
};

const MAX_SECTIONS = 4;

const Footer2 = (props: Props) => {
    const { logo, description, sections, copyright, legalLinks, className } = {
        ...defaultProps,
        ...props,
    };

    const visibleSections = (sections ?? []).slice(0, MAX_SECTIONS);

    return (
        <section className={cn('bg-white dark:bg-[#0a0a0a] py-20', className)}>
            <div className="container mx-auto px-6">
                <footer>

                    {/* TOP */}
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">

                        {/* LOGO + DESCRIPTION (NO HOVER ANIMATION HERE) */}
                        <div className="lg:col-span-2">

                            <a
                                href={logo?.url}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={logo?.src}
                                    alt={logo?.alt}
                                    title={logo?.title}
                                    className="h-14 md:h-16 object-contain"
                                />

                                <div>
                                    <h2 className="text-sm font-semibold text-[#16036c] dark:text-white">
                                        OSSP
                                    </h2>
                                </div>
                            </a>

                            <p className="mt-5 text-sm leading-relaxed text-muted-foreground max-w-sm">
                                {description}
                            </p>
                        </div>

                        {/* LINKS (KEEP VERCEL ANIMATION HERE) */}
                        {visibleSections.map((section, i) => (
                            <div key={i}>
                                <h3 className="mb-4 text-sm font-semibold text-[#16036c] dark:text-white">
                                    {section.title}
                                </h3>

                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <a
                                                href={link.href}
                                                className="vercel-link hover:text-[#16036c] dark:hover:text-white"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">

                        <p>{copyright}</p>

                        <div className="flex gap-4">
                            {legalLinks?.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.href}
                                    className="vercel-link hover:text-[#16036c] dark:hover:text-white"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                </footer>
            </div>
        </section>
    );
};

export { Footer2 };