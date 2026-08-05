export type CompanyModuleGroupKey = 
  | 'company'
  | 'product'
  | 'resources'
  | 'trust'
  | 'media'
  | 'business';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  description?: string;
  isPreserved?: boolean;
}

export interface NavGroup {
  key: CompanyModuleGroupKey;
  label: string;
  description: string;
  items: NavItem[];
}

export interface RelatedPageRef {
  title: string;
  description: string;
  href: string;
  groupLabel: string;
}

export interface ContextualCTA {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}
