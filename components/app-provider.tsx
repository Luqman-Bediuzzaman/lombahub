"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserProfile, WorkspaceItem, WorkspaceStatus, Competition } from "@/lib/types";
import { EMPTY_PROFILE, restoreProfile } from "@/lib/profile-context";
import { competitions as demoCompetitions } from "@/lib/demo-data";

const STORAGE_KEY = "jejakarsa-workspace-v1";
const PROFILE_KEY = "jejakarsa-profile-v1";
const COMPARE_KEY = "jejakarsa-compare-v1";

const emptyProfile = EMPTY_PROFILE;

type AppContextValue = {
  competitions: Competition[];
  catalogMode: "demo" | "live" | "unavailable";
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
  workspace: WorkspaceItem[];
  isSaved: (competitionId: string) => boolean;
  toggleSaved: (competitionId: string) => void;
  updateStatus: (competitionId: string, status: WorkspaceStatus) => void;
  toggleChecklist: (competitionId: string, task: string) => void;
  updateNotes: (competitionId: string, notes: string) => void;
  compareIds: string[];
  toggleCompare: (competitionId: string) => void;
  removeFromWorkspace: (competitionId: string) => void;
  hydrated: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, competitions = demoCompetitions, catalogMode = "demo" }: { children: ReactNode; competitions?: Competition[]; catalogMode?: "demo" | "live" | "unavailable" }) {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [workspace, setWorkspace] = useState<WorkspaceItem[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedWorkspace = localStorage.getItem(STORAGE_KEY);
      const savedCompare = localStorage.getItem(COMPARE_KEY);
      if (savedProfile) setProfile(restoreProfile(JSON.parse(savedProfile)));
      if (savedWorkspace) {
        const loaded: WorkspaceItem[] = JSON.parse(savedWorkspace);
        setWorkspace(loaded.map(item => {
          const competition = competitions.find(c => c.id === item.competitionId);
          if (!competition?.checklistItems) return item;
          const checklist = { ...item.checklist };
          for (const step of competition.checklistItems) {
            if (!(step.id in checklist)) checklist[step.id] = Boolean(checklist[step.title]);
          }
          return { ...item, checklist };
        }));
      }
      if (savedCompare) setCompareIds(JSON.parse(savedCompare));
    } catch {
      // Corrupt or unavailable local storage should not prevent app usage.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
    } catch {
      // The current session remains usable even if persistence is unavailable.
    }
  }, [profile, workspace, compareIds, hydrated]);

  const updateProfile = useCallback((next: UserProfile) => setProfile(next), []);
  const resetProfile = useCallback(() => setProfile(emptyProfile), []);

  const isSaved = useCallback((competitionId: string) => workspace.some((item) => item.competitionId === competitionId), [workspace]);

  const toggleSaved = useCallback((competitionId: string) => {
    setWorkspace((current) => {
      const existing = current.find((item) => item.competitionId === competitionId);
      if (existing) return current.filter((item) => item.competitionId !== competitionId);
      const competition = competitions.find((item) => item.id === competitionId);
      const checklist: Record<string, boolean> = {};
      if (competition?.checklistItems) competition.checklistItems.forEach(step => { checklist[step.id] = false; });
      else competition?.checklist.forEach(task => { checklist[task] = false; });
      return [...current, { competitionId, status: "saved", checklist, notes: "", updatedAt: new Date().toISOString() }];
    });
  }, [competitions]);

  const updateStatus = useCallback((competitionId: string, status: WorkspaceStatus) => {
    setWorkspace((current) => current.map((item) => item.competitionId === competitionId ? { ...item, status, updatedAt: new Date().toISOString() } : item));
  }, []);

  const toggleChecklist = useCallback((competitionId: string, task: string) => {
    setWorkspace((current) => current.map((item) => item.competitionId === competitionId ? { ...item, checklist: { ...item.checklist, [task]: !item.checklist[task] }, updatedAt: new Date().toISOString() } : item));
  }, []);

  const updateNotes = useCallback((competitionId: string, notes: string) => {
    setWorkspace((current) => current.map((item) => item.competitionId === competitionId ? { ...item, notes, updatedAt: new Date().toISOString() } : item));
  }, []);

  const toggleCompare = useCallback((competitionId: string) => {
    setCompareIds((current) => {
      const active = current.filter(id => competitions.some(c => c.id === id));
      return active.includes(competitionId)
        ? active.filter(id => id !== competitionId)
        : active.length >= 3 ? active : [...active, competitionId];
    });
  }, [competitions]);

  const removeFromWorkspace = useCallback((competitionId: string) => {
    setWorkspace((current) => current.filter((item) => item.competitionId !== competitionId));
  }, []);

  const value = useMemo(() => ({ competitions, catalogMode, profile, updateProfile, resetProfile, workspace, isSaved, toggleSaved, updateStatus, toggleChecklist, updateNotes, compareIds, toggleCompare, removeFromWorkspace, hydrated }), [competitions, catalogMode, profile, updateProfile, resetProfile, workspace, isSaved, toggleSaved, updateStatus, toggleChecklist, updateNotes, compareIds, toggleCompare, removeFromWorkspace, hydrated]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
