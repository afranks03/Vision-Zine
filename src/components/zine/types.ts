import type {
  AchievementsContent,
  BioContent,
  GoalsContent,
  PersonalContent,
  ResumeContent,
  TenetsContent,
  VisionContent,
  ZineFormat,
  ZineRow,
  ZineStyle,
} from '@/lib/supabase/types';

/**
 * The denormalized shape every spread component reads from. Built by the
 * preview route from `zines` + all `zine_data` rows for the issue.
 */
export interface RenderableZine {
  zine: ZineRow;
  personal: Partial<PersonalContent>;
  vision: Partial<VisionContent>;
  bio: Partial<BioContent>;
  resume: Partial<ResumeContent>;
  achievements: Partial<AchievementsContent>;
  goals: Partial<GoalsContent>;
  tenets: Partial<TenetsContent>;
}

export interface SpreadProps {
  data: RenderableZine;
}

export interface ZineRootProps {
  data: RenderableZine;
  /** Style and format are read off `data.zine` but exposed here for override during preview. */
  styleOverride?: ZineStyle;
  formatOverride?: ZineFormat;
}
