export interface Campaign {
  id: number;
  name: string;
  slug: string;
  description: string;
  email_subject: string;
  cta_text: string;
  status: string;
  platform: string;
  budget_usd: number;
  created_at: string;
}
export interface Event {
  id: number;
  campaign_id: number;
  name: string;
  event_date: string;
  location: string;
  capacity: number;
  description: string;
}
export interface CampaignWithEvents extends Campaign {
  events: Event[];
}
export interface Submission {
  id: number;
  campaign_id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  submitted_at: string;
}
export interface SeedData {
  campaigns: Campaign[];
  events: Event[];
}
export interface LandingSubmissionRequest {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}
export interface SubmissionWithCampaign {
  id: number;
  campaign_id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  submitted_at: string;
  campaign_name: string;
}
export interface SendCampaignEmailRequest {
  recipientEmail: string;
}