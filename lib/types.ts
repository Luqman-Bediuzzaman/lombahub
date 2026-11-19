export type Level = "SMA" | "D3" | "S1" | "S2" | "Umum";
export type Participation = "Individu" | "Tim" | "Individu atau Tim";
export type DeliveryMode = "Online" | "Offline" | "Hybrid";
export type FeeStatus = "Gratis" | "Berbayar" | "Belum diketahui";
export type RequirementField = "educationLevel" | "studyProgram" | "teamSize" | "fee" | "region" | "submission";
export type EvidenceStatus = "verified" | "ambiguous" | "unverified";

export interface Evidence {
  sourceTitle: string;
  sourceUrl?: string;
  sourceId?: string;
  location: string;
  excerpt: string;
  checkedAt: string;
  status: EvidenceStatus;
  note?: string;
}

export interface Requirement {
  id: string;
  label: string;
  field: RequirementField;
  value: string;
  rule: string;
  allowedPrograms?: string[];
  evidence: Evidence;
}

export interface Competition {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  category: string;
  discipline: string;
  level: Level[];
  participation: Participation;
  minTeamSize: number | null;
  maxTeamSize: number | null;
  feeStatus: FeeStatus;
  feeAmount: number | null;
  mode: DeliveryMode;
  location: string;
  deadline: string;
  publishedAt: string;
  updatedAt?: string;
  deadlineTime?: string;
  deadlineTimezone?: string;
  submissionDeadline?: string;
  feeCurrency?: "IDR" | "USD" | "Lainnya";
  feeUnit?: string;
  feeNote?: string;
  scope?: string;
  eligibilityIndonesia?: "Ya" | "Tidak" | "Belum dipastikan";
  institutionRules?: string;
  regionRules?: string;
  edition?: string;
  submitter?: string;
  eventStages?: { id: string; title: string; date: string; mode: DeliveryMode; location: string }[];
  posterUrl?: string;
  registrationUrl?: string;
  guideUrl?: string;
  sources?: { id: string; title: string; url: string; kind: string; checkedAt: string; note: string }[];
  checklistItems?: { id: string; title: string; detail: string; mandatory: boolean; sourceId: string }[];
  summary: string;
  description: string;
  theme: string;
  prize: string;
  requirements: Requirement[];
  checklist: string[];
  sourceName: string;
  sourceUrl: string;
  verificationStatus: "sample" | "verified" | "needs-review";
  verificationNote: string;
}

export interface UserProfile {
  educationLevel: Level | "";
  studyProgram: string;
  region: string;
  budget: number;
  preferredCategories: string[];
  preferredMode: DeliveryMode | "";
  canJoinTeam: boolean;
  availableTeamMembers: number;
  budgetConfirmed?: boolean;
  teamConfirmed?: boolean;
}

export type EligibilityState = "eligible" | "needs-review" | "not-eligible" | "incomplete";
export type CheckState = "match" | "mismatch" | "unknown" | "not-applicable" | "preference-conflict";

export interface EligibilityCheck {
  requirement: Requirement;
  state: CheckState;
  explanation: string;
}

export interface EligibilityResult {
  state: EligibilityState;
  checks: EligibilityCheck[];
  matched: number;
  unknown: number;
  mismatched: number;
  summary: string;
}

export type WorkspaceStatus = "saved" | "evaluating" | "preparing" | "submitted" | "completed";

export interface WorkspaceItem {
  competitionId: string;
  status: WorkspaceStatus;
  checklist: Record<string, boolean>;
  notes: string;
  updatedAt: string;
}

export interface Playbook {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  accent: "sage" | "blue" | "amber";
  featured: boolean;
  coverLabel?: string;
}
