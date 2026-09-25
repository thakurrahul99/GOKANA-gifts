/**
 * Centralised Business Information Configuration for GŌKANA Gifts
 * Verified details updated for customer support, location, and social channels.
 */

export const BUSINESS_INFO = {
  brandName: 'GŌKANA Gifts',
  shortBrandName: 'GŌKANA',
  tagline: 'Gifts • Curated • With Love',
  website: 'https://gokana.in',
  phone: {
    display: '+91 9220806027',
    raw: '+919220806027',
    tel: 'tel:+919220806027',
  },
  whatsapp: {
    number: '919220806027',
    display: '+91 9220806027',
    raw: '+919220806027',
    url: 'https://wa.me/919220806027',
    buildUrl: (message) => {
      const text = message ? `?text=${encodeURIComponent(message)}` : '';
      return `https://wa.me/919220806027${text}`;
    },
  },
  email: {
    address: 'gokanagifts@gmail.com',
    mailto: 'mailto:gokanagifts@gmail.com',
    buildMailto: (subject, body) => {
      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (body) params.set('body', body);
      const query = params.toString();
      return `mailto:gokanagifts@gmail.com${query ? `?${query}` : ''}`;
    },
  },
  location: {
    city: 'Mathura',
    state: 'Uttar Pradesh',
    country: 'India',
    display: 'Mathura, Uttar Pradesh, India',
    short: 'Mathura, Uttar Pradesh',
  },
  supportHours: {
    display: '10:00 AM – 10:00 PM IST',
    short: '10 AM – 10 PM IST',
    // Note: Support days are unconfirmed and pending owner confirmation.
  },
  socials: {
    instagram: {
      handle: '@gokanagifts',
      url: 'https://www.instagram.com/gokanagifts/',
      label: 'Follow @gokanagifts on Instagram',
    },
    facebook: {
      url: 'https://www.facebook.com/profile.php?id=61594911050422',
      label: 'Follow GŌKANA Gifts on Facebook',
    },
    youtube: {
      handle: '@gokanagifts-b1m',
      url: 'https://youtube.com/@gokanagifts-b1m',
      label: 'Subscribe to GŌKANA Gifts on YouTube',
    },
  },
};
