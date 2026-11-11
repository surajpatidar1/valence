/**
 * Contact details used across the site. Fill these in before launch.
 * Any option left empty ('') is hidden automatically.
 */
export const CONTACT = {
  /** Your business email. */
  email: '[REAL EMAIL]',

  /** WhatsApp number with country code, digits only, e.g. '919876543210'. */
  whatsapp: '',

  /** Booking link from Calendly, Cal.com or Google Calendar appointment pages. */
  bookingUrl: '[BOOKING LINK, e.g. Cal.com or Calendly]',

  /**
   * Where the contact form sends messages, e.g. a Formspree endpoint
   * ('https://formspree.io/f/xxxxxx') or your own API route.
   */
  formEndpoint: '[FORM ENDPOINT]',

  /** Endpoint for partner developer applications (/partners). */
  partnerFormEndpoint: '[FORM ENDPOINT, e.g. Formspree URL or my n8n webhook URL]',

  /** Endpoint for company developer requests (/partners). */
  companyRequestEndpoint: '[COMPANY REQUEST ENDPOINT]',

  /** Endpoint for review submissions (/reviews). */
  reviewFormEndpoint: '[REVIEW FORM ENDPOINT]',

  responseTime: 'We usually reply within one business day.',
};
