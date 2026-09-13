import { useEffect } from 'react';

const SITE_URL = 'https://bangyen.github.io';
const DEFAULT_DESCRIPTION =
    'Portfolio of Bangyen Pham, a backend developer and AI/ML engineer building cloud systems, research visualizations, and interactive algorithms.';

interface PageMetadataProps {
    title: string;
    description?: string;
    path?: string;
}

const setMeta = (selector: string, value: string) => {
    document
        .querySelector<HTMLMetaElement>(selector)
        ?.setAttribute('content', value);
};

export function PageMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    path = globalThis.location.pathname,
}: PageMetadataProps) {
    useEffect(() => {
        const canonicalUrl = new URL(path, SITE_URL).toString();
        document.title = title;
        setMeta('meta[name="description"]', description);
        setMeta('meta[property="og:title"]', title);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[property="og:url"]', canonicalUrl);
        setMeta('meta[name="twitter:title"]', title);
        setMeta('meta[name="twitter:description"]', description);
        setMeta('meta[name="twitter:url"]', canonicalUrl);
        document
            .querySelector<HTMLLinkElement>('link[rel="canonical"]')
            ?.setAttribute('href', canonicalUrl);
    }, [description, path, title]);

    return null;
}
