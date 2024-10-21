import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { i18nConfig, locales } from '../config/i18n-metadata';

export { i18nConfig };
export const AllLocales = locales;

export const { usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: AllLocales,
  localePrefix: i18nConfig.localePrefix,
});
