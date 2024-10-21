import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales} from "@/config/i18n-metadata";

export default getRequestConfig(async ({locale}) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        messages: (await import(`../locales/${locale}.json`)).default
    };
});
