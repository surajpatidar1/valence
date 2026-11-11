export type ProjectType =
  | 'Website'
  | 'Mobile app'
  | 'SEO'
  | 'Automation'
  | 'AI/LLM'
  | 'Developers';

export interface Review {
  id: string;
  quote: string;
  clientName: string;
  clientRole: string;
  company: string;
  projectType: ProjectType;
  rating?: number; // 1-5 optional
  date: string;
  approved: boolean;
}

/**
 * Reviews array starts EMPTY.
 * Only reviews with approved: true are displayed.
 * Do NOT invent any reviews, client names, ratings or statistics.
 */
export const REVIEWS: Review[] = [];

/** Approved reviews only */
export const APPROVED_REVIEWS: Review[] = REVIEWS.filter((r) => r.approved);

/** Flag determining whether at least one approved review exists */
export const HAS_APPROVED_REVIEWS: boolean = APPROVED_REVIEWS.length > 0;

