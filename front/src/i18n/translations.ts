export type Language = 'en' | 'tw' | 'ga';

export interface Translations {
  [key: string]: string | Translations;
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      events: 'Events',
      sermons: 'Sermons',
      ministries: 'Ministries',
      contact: 'Contact',
      giveNow: 'Give Now',
    },
    footer: {
      quickLinks: 'Quick Links',
      serviceTimes: 'Service Times',
      contactUs: 'Contact Us',
      sundayWorship: 'Sunday Worship',
      bibleStudy: 'Bible Study',
      prayerMeeting: 'Prayer Meeting',
      copyright: '© {year} Trinity Lutheran Church Ghana. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      close: 'Close',
      submit: 'Submit',
      cancel: 'Cancel',
    },
  },
  tw: {
    nav: {
      home: 'Akotea',
      about: 'Asem',
      events: 'Amanneɛ',
      sermons: 'Asɛm Kronkron',
      ministries: 'Adwuma',
      contact: 'Kɔ Nka',
      giveNow: 'Ma Sika',
    },
    footer: {
      quickLinks: 'Akwan Ntɛm',
      serviceTimes: 'Asɛm Bere',
      contactUs: 'Kɔ Nka Yɛn',
      sundayWorship: 'Dwoada Asɛm',
      bibleStudy: 'Baibul Sudie',
      prayerMeeting: 'Adɔeɛ Bere',
      copyright: '© {year} Trinity Lutheran Church Ghana. Ɔkwan Nyinaa Wɔ Yɛn.',
      privacyPolicy: 'Aseɛ Nkrataa',
      termsOfService: 'Ɔkwan Nyinaa',
    },
    common: {
      loading: 'Retwɛn...',
      error: 'Sɔre',
      retry: 'Sɔ Frɛ',
      close: 'Twe',
      submit: 'Tumi',
      cancel: 'Twe Akyi',
    },
  },
  ga: {
    nav: {
      home: 'Akapo',
      about: 'Asɛm',
      events: 'Amanneɛ',
      sermons: 'Asɛm Kronkron',
      ministries: 'Adwuma',
      contact: 'Kɔ Nka',
      giveNow: 'Ma Sika',
    },
    footer: {
      quickLinks: 'Akwan Ntɛm',
      serviceTimes: 'Asɛm Bere',
      contactUs: 'Kɔ Nka Yɛn',
      sundayWorship: 'Dwoada Asɛm',
      bibleStudy: 'Baibul Sudie',
      prayerMeeting: 'Adɔeɛ Bere',
      copyright: '© {year} Trinity Lutheran Church Ghana. Ɔkwan Nyinaa Wɔ Yɛn.',
      privacyPolicy: 'Aseɛ Nkrataa',
      termsOfService: 'Ɔkwan Nyinaa',
    },
    common: {
      loading: 'Retwɛn...',
      error: 'Sɔre',
      retry: 'Sɔ Frɛ',
      close: 'Twe',
      submit: 'Tumi',
      cancel: 'Twe Akyi',
    },
  },
};
