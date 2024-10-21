import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from "@/config/i18n-metadata";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix,
});

export default async function middlewareHandler(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Exclude static resources and API routes
    const staticFilePattern = /^\/(_next\/|_static\/|static\/|favicon\.ico|site\.webmanifest|robots\.txt|ads\.txt|sitemap\.xml|apple-touch-icon\.png)/;
    const apiPattern = /^\/api\//;
    if (staticFilePattern.test(pathname) || apiPattern.test(pathname)) {
        return NextResponse.next();
    }

    // Call the next-intl middleware
    return intlMiddleware(req);
}

export const config = {
    // Match all pathnames except for static files and API routes
    matcher: ['/((?!api|_next|_static|static|favicon\\.ico|site\\.webmanifest|robots\\.txt|sitemap\\.xml).*)']
};
