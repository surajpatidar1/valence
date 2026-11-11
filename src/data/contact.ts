/**
 * Contact details used across the site. Fill these in before launch.
 * Any option left empty ('') is hidden automatically.
 */
export const CONTACT = {
  /** Your business email. */
  email: 'hello@valance.example',

  /** WhatsApp number with country code, digits only, e.g. '919876543210'. */
  whatsapp: '',

  /** Booking link from Calendly, Cal.com or Google Calendar appointment pages. */
  bookingUrl: '',

  /**
   * Where the contact form sends messages, e.g. a Formspree endpoint
   * ('https://formspree.io/f/xxxxxx') or your own API route.
   * If empty, the form opens the visitor's email app with the message pre-filled.
   */
  formEndpoint: '',

  responseTime: 'We usually reply within one business day.',
};
