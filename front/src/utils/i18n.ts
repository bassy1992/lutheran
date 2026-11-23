/**
 * Utility functions for internationalization
 */

export const getLanguageLabel = (lang: string): string => {
  const labels: Record<string, string> = {
    en: 'English',
    tw: 'Twi',
    ga: 'Ga',
  };
  return labels[lang] || lang;
};

export const getLanguageCode = (lang: string): string => {
  const codes: Record<string, string> = {
    en: 'en',
    tw: 'tw',
    ga: 'ga',
  };
  return codes[lang] || 'en';
};

export const isValidLanguage = (lang: string): boolean => {
  return ['en', 'tw', 'ga'].includes(lang);
};
