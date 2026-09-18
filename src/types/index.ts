export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved';

export interface ReportedIssue {
  id: string;
  issue_type: string;
  description: string;
  location: string;
  photo_url: string | null;
  status: IssueStatus;
  created_at: string;
}

export type PostType = 'offering' | 'needing';

export interface UbuntuPost {
  id: string;
  post_type: PostType;
  name: string;
  item: string;
  location: string;
  whatsapp: string;
  created_at: string;
}

export interface TrustedService {
  id: string;
  category: string;
  name: string;
  rating: number;
  price_range: string;
  phone: string;
  verified: boolean;
  created_at: string;
}
