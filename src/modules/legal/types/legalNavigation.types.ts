export interface LegalNavItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  isExternal?: boolean;
}

export interface LegalNavGroup {
  groupKey: 'core' | 'data' | 'policies' | 'trust';
  groupLabel: string;
  items: LegalNavItem[];
}
