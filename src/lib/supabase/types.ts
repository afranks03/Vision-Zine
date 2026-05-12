/**
 * Hand-written database types matching supabase/migrations/20260511014420_initial_schema.sql.
 *
 * When we set up `supabase gen types typescript` (after `supabase link`), this
 * file will be auto-generated. For now we maintain it by hand so the JS client
 * stays typed.
 */

export type ZineStyle =
  | 'editorial'
  | 'lifestyle'
  | 'fashion'
  | 'art_catalog'
  | 'travel'
  | 'financial';

export type ZineFormat = 'letter' | 'tabloid' | 'pocket';

export type ZineStatus = 'draft' | 'paid' | 'generating' | 'printed' | 'archived';

export type SectionKey =
  | 'personal'
  | 'vision'
  | 'bio'
  | 'resume'
  | 'achievements'
  | 'goals'
  | 'tenets'
  | 'online'
  | 'documents'
  | 'coauthor';

export type AssetType = 'document' | 'image' | 'audio' | 'other';

export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export type SubscriptionTier = 'free' | 'one_issue' | 'annual';

/* ---- row shapes ---- */

export interface ZineRow {
  id: string;
  user_id: string;
  title: string | null;
  issue_number: number;
  style: ZineStyle;
  format: ZineFormat;
  status: ZineStatus;
  /** When true, /z/[id] renders publicly without auth. */
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ZineDataRow {
  id: string;
  zine_id: string;
  section_key: SectionKey;
  content_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ZineAssetRow {
  id: string;
  zine_id: string;
  asset_type: AssetType;
  storage_path: string;
  url: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  original_filename: string | null;
  created_at: string;
}

export interface CoauthorInvitationRow {
  id: string;
  zine_id: string;
  email: string;
  status: InvitationStatus;
  token: string;
  invited_by: string;
  accepted_by: string | null;
  created_at: string;
  accepted_at: string | null;
}

export type PrintOrderStatus =
  | 'pending'
  | 'rendering'
  | 'uploading'
  | 'submitted'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'failed';

export interface PrintOrderRow {
  id: string;
  zine_id: string;
  user_id: string;
  stripe_session_id: string | null;
  lulu_print_job_id: string | null;
  shipping_address: Record<string, unknown> | null;
  status: PrintOrderStatus;
  status_detail: string | null;
  tracking_url: string | null;
  cover_pdf_url: string | null;
  cover_pdf_md5: string | null;
  pod_package_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  tier: SubscriptionTier | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

/* ---- typed Database root for supabase-js ---- */

export interface Database {
  public: {
    Tables: {
      zines: {
        Row: ZineRow;
        Insert: Partial<Omit<ZineRow, 'id' | 'created_at' | 'updated_at'>> & {
          user_id: string;
        };
        Update: Partial<Omit<ZineRow, 'id' | 'user_id' | 'created_at'>>;
        Relationships: [];
      };
      zine_data: {
        Row: ZineDataRow;
        Insert: Partial<Omit<ZineDataRow, 'id' | 'created_at' | 'updated_at'>> & {
          zine_id: string;
          section_key: SectionKey;
        };
        Update: Partial<Omit<ZineDataRow, 'id' | 'zine_id' | 'created_at'>>;
        Relationships: [];
      };
      zine_assets: {
        Row: ZineAssetRow;
        Insert: Partial<Omit<ZineAssetRow, 'id' | 'created_at'>> & {
          zine_id: string;
          asset_type: AssetType;
          storage_path: string;
        };
        Update: Partial<Omit<ZineAssetRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
      coauthor_invitations: {
        Row: CoauthorInvitationRow;
        Insert: Partial<Omit<CoauthorInvitationRow, 'id' | 'token' | 'created_at'>> & {
          zine_id: string;
          email: string;
          invited_by: string;
        };
        Update: Partial<Omit<CoauthorInvitationRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: Partial<Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'>> & {
          user_id: string;
        };
        Update: Partial<Omit<SubscriptionRow, 'id' | 'user_id' | 'created_at'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/* ---- section content payloads (typed JSONB) ---- */
// Each section's content_json conforms to one of these shapes. The studio
// reads/writes these. Sections we haven't built yet have permissive shapes
// that'll tighten as we build them.

export interface PersonalContent {
  full_name?: string;
  display_name?: string;
  pronouns?: string;
  location?: string;
  birth_year?: number;
  short_intro?: string;
}

export interface GoalsContent {
  financial?: string[];
  creative?: string[];
  place?: string[];
  body_spirit?: string[];
}

export interface TenetsContent {
  tenets?: string[]; // exactly 10 ideal
}

export interface VisionContent {
  statement?: string;
  draft_history?: { text: string; at: string }[];
}

export interface BioContent {
  raw_paste?: string;
  summary?: string;
}

export interface ResumeContent {
  raw_paste?: string;
  highlights?: string[];
}

export interface AchievementsContent {
  items?: { title: string; year?: number; tag?: string }[];
}

export interface OnlineContent {
  urls?: { url: string; title?: string; description?: string }[];
}

export interface DocumentsContent {
  // The assets themselves live in zine_assets; this is just notes/captions.
  notes?: string;
}

export interface CoauthorContent {
  partner_display_name?: string;
  // The invited partner fills their own section keys; this is the owner's
  // notes about the relationship for the Joint Venture section.
  joint_notes?: string;
}

export type SectionContentMap = {
  personal: PersonalContent;
  vision: VisionContent;
  bio: BioContent;
  resume: ResumeContent;
  achievements: AchievementsContent;
  goals: GoalsContent;
  tenets: TenetsContent;
  online: OnlineContent;
  documents: DocumentsContent;
  coauthor: CoauthorContent;
};

export type SectionContent<K extends SectionKey> = SectionContentMap[K];
