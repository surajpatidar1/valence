export type Category = 'Web' | 'App' | 'SEO' | 'Automation' | 'AI';
export type Project = {
  id?: number;
  title: string;
  client?: string | null;
  category: string;
  year?: string | null;
  summary: string;
  solution?: string | null;
  metric?: string | null;
  tags: string[];
  image?: string | null;
  url?: string | null;
  isFeatured?: boolean;
};

export const PROJECTS: Project[] = [];
export const HAS_PROJECTS = false;
