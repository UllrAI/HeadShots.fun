export const localeItems = [
{code: 'en', name: 'English'},
{code: 'zh-hans', name: '简体中文'},
// {code: 'de', name: 'Deutsch'},
// {code: 'es', name: 'Español'},
// {code: 'fr', name: 'Français'},
// {code: 'id', name: 'Bahasa Indonesia'},
// {code: 'ja', name: '日本語'},
// {code: 'ms', name: 'Bahasa Melayu'},
// {code: 'pt', name: 'Português'},
// {code: 'ru', name: 'Русский'},
// {code: 'zh-hant', name: '正體中文'},
//{code: 'ar', name: 'العربية'},
//{code: 'hi', name: 'हिन्दी'},
//{code: 'it', name: 'Italiano'},
//{code: 'ko', name: '한국어'},
//{code: 'th', name: 'ไทย'},
//{code: 'vi', name: 'Tiếng Việt'},
];

export const locales = localeItems.map((item) => item.code);
export const defaultLocale = 'en';
export const localePrefix = 'as-needed' as const;

export const i18nConfig = {
  name: 'HeadShots.fun',
  locales: localeItems,
  defaultLocale,
  localePrefix,
};
