export type SiteContentType = 'help_support' | 'terms' | 'privacy';

export interface SiteContentSection {
  heading: string;
  body: string;
}

export interface SiteContentFaq {
  question: string;
  answer: string;
}

export interface SiteContent {
  type: SiteContentType;
  title: string;
  intro: string;
  sections: SiteContentSection[];
  faqs: SiteContentFaq[];
  supportEmail: string;
  supportPhone: string;
  updatedAt: string | null;
}

export interface UpdateSiteContentInput {
  title: string;
  intro: string;
  sections: SiteContentSection[];
  faqs: SiteContentFaq[];
  supportEmail: string;
  supportPhone: string;
}
