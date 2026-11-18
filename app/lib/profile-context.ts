import type { UserProfile } from "./types";

export const EMPTY_PROFILE: UserProfile = {
  educationLevel: "", studyProgram: "", region: "", budget: 0,
  preferredCategories: [], preferredMode: "", canJoinTeam: true,
  availableTeamMembers: 1, budgetConfirmed: false, teamConfirmed: false,
};

export function hasPrimaryProfile(profile: UserProfile) {
  return ["SMA", "D3", "S1", "S2", "Umum"].includes(profile.educationLevel)
    && Boolean(profile.studyProgram.trim());
}
export function hasBudgetAnswer(profile: UserProfile) {
  return profile.budgetConfirmed ?? profile.budget > 0;
}
export function hasTeamAnswer(profile: UserProfile) {
  return profile.teamConfirmed ?? (!profile.canJoinTeam || profile.availableTeamMembers > 1);
}
export function hasRecommendationContext(profile: UserProfile) {
  return Boolean(profile.educationLevel || profile.studyProgram.trim()
    || profile.preferredCategories.length || profile.preferredMode
    || hasBudgetAnswer(profile) || hasTeamAnswer(profile));
}
export function restoreProfile(saved: Partial<UserProfile>): UserProfile {
  return {
    ...EMPTY_PROFILE, ...saved,
    budgetConfirmed: saved.budgetConfirmed ?? (typeof saved.budget === "number" && saved.budget > 0),
    teamConfirmed: saved.teamConfirmed ?? (saved.canJoinTeam === false || (saved.availableTeamMembers ?? 1) > 1),
  };
}
