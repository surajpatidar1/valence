/**
 * Portfolio projects.
 *
 * HOW TO ADD A REAL PROJECT
 * 1. Put a screenshot in /public/portfolio/ (1600×1000 px, .webp or .jpg works best).
 * 2. Add an entry below with `image: '/portfolio/your-file.webp'`.
 * 3. Delete the `sample: true` entries once you have real work to show.
 *
 * Entries marked `sample: true` are only shown in development (`npm run dev`)
 * and are automatically removed from the production build. If no real projects
 * exist, the Work section and its nav link are hidden on the live site.
 */

export type Category = 'Web' | 'App' | 'SEO' | 'Automation' | 'AI';

export type Project = {
  title: string;
  client?: string;
  category: Category;
  year: string;
  summary: string;
  tags: string[];
  /** Screenshot path under /public, e.g. '/portfolio/acme.webp'. A mockup is shown if omitted. */
  image?: string;
  /** Live site, App Store link or case-study URL. */
  url?: string;
  /** Placeholder for layout preview only. Never shown in production. */
  sample?: boolean;
};

const ALL_PROJECTS: Project[] = [
  {
    title: 'Company website redesign',
    category: 'Web',
    year: '2026',
    summary: 'Sample entry. Replace with a short description of the problem, what you built and the result.',
    tags: ['Next.js', 'CMS', 'SEO'],
    sample: true,
  },
  {
    title: 'Booking app for iOS & Android',
    category: 'App',
    year: '2026',
    summary: 'Sample entry. Describe the app, who it is for and what makes it work well.',
    tags: ['React Native', 'Firebase'],
    sample: true,
  },
  {
    title: 'Invoice processing automation',
    category: 'Automation',
    year: '2026',
    summary: 'Sample entry. Explain the manual process you replaced and the time it saves.',
    tags: ['n8n', 'Xero', 'Python'],
    sample: true,
  },
  {
    title: 'Customer support assistant',
    category: 'AI',
    year: '2026',
    summary: 'Sample entry. Summarise the AI feature, the model used and how it helps the client.',
    tags: ['LLM', 'RAG', 'Node.js'],
    sample: true,
  },
];

export const PROJECTS = import.meta.env.PROD ? ALL_PROJECTS.filter((p) => !p.sample) : ALL_PROJECTS;
export const HAS_PROJECTS = PROJECTS.length > 0;
