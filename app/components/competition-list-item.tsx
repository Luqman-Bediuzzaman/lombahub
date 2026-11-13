import Link from "next/link";
import type { ReactNode } from "react";
import { VerificationStatus } from "../design-system";
import {
  type Competition,
  deadlineSignal,
  formatCurrency,
  formatPrimaryDeadline,
  deadlineFieldLabel,
} from "../data/competitions";

type Props = {
  competition: Competition;
  today: string | null;
  variant: "accordion" | "catalog";
  isExpanded?: boolean;
  onToggle?: (id: number) => void;
  children?: ReactNode;
};

function Chevron({ rotated }: { rotated: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center border border-[#D1CCBE] text-[#526249] transition-[transform,border-color,background-color] duration-200 dark:border-[#46503D] dark:text-[#B5C4A5] ${rotated ? "rotate-180 border-[#65745A] bg-[#E8ECE2] dark:bg-[#283225]" : ""}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

/** The SAME row hierarchy on Base and Katalog; interaction is configured by variant. */
function CompetitionSummary({ competition, today, accordion, expanded }: {
  competition: Competition;
  today: string | null;
  accordion: boolean;
  expanded: boolean;
}) {
  const signal = deadlineSignal(competition.deadline, today);
  const urgent = signal && signal !== "Tenggat lewat";
  const signalClass = urgent
    ? "text-[#A34F31] dark:text-[#E7A080]"
    : "text-[#706E61] dark:text-[#A9AC9F]";
  const period = formatPrimaryDeadline(competition);
  return (
    <>
      {/* Mobile & tablet: retain the dense information-first layout from V2. */}
      <div className="min-w-0 lg:hidden">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="min-w-0 truncate font-mono text-[11px] font-semibold uppercase tracking-[0.035em] text-[#526249] dark:text-[#B5C4A5]">
            {competition.category} <span className="text-[#777568] dark:text-[#A9AC9F]">·</span> {competition.level}
          </span>
          {accordion && <Chevron rotated={expanded} />}
        </div>
        <h3 className="mt-1 text-[15px] font-bold leading-[1.32] text-[#2C2C2C] dark:text-[#EAE8E0]">
          {competition.title}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-[1.4] text-[#55574E] dark:text-[#BFC4B7]">
          {competition.organizer} <span aria-hidden="true">·</span> {competition.format} <span aria-hidden="true">·</span> {competition.eligibility}
        </p>
        <div className="mt-1.5 flex min-w-0 items-baseline justify-between gap-3 border-t border-[#E1DDD1] pt-2 dark:border-[#343B30]">
          <span className="min-w-0 text-[12px] font-medium leading-[1.4] text-[#34362F] dark:text-[#D0D3C7]">{period}</span>
          <span className="shrink-0 text-[12px] font-semibold text-[#34362F] dark:text-[#EAE8E0]">{formatCurrency(competition.fee)}</span>
        </div>
        <div className="mt-0.5 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
          <VerificationStatus isVerified={competition.isVerified} />
          {signal && <span className={`text-[11px] font-medium ${signalClass}`}>{signal}</span>}
        </div>
      </div>

      {/* Desktop: stable cross-page column alignment and no tall placeholders. */}
      <div className={`hidden min-w-0 items-center gap-4 lg:grid lg:px-4 lg:py-3 xl:gap-5 ${accordion
        ? "lg:grid-cols-[160px_minmax(0,1fr)_245px_32px] xl:grid-cols-[180px_minmax(0,1fr)_260px_32px]"
        : "lg:grid-cols-[160px_minmax(0,1fr)_245px] xl:grid-cols-[180px_minmax(0,1fr)_260px]"}`}>
        <div className="min-w-0">
          <span className="inline-flex max-w-full border border-[#CBC7BA] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.035em] text-[#55574E] dark:border-[#46503D] dark:text-[#B7BBAE]">{competition.category}</span>
          <p className="mt-1 truncate text-[12px] leading-4 text-[#55574E] dark:text-[#BFC4B7]">{competition.organizer}</p>
          <div className="mt-0.5"><VerificationStatus isVerified={competition.isVerified} /></div>
        </div>
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold leading-[1.3] text-[#2C2C2C] dark:text-[#EAE8E0]">{competition.title}</h3>
          <p className="mt-1 text-[12px] leading-[1.4] text-[#626156] dark:text-[#BFC4B7]">
            {competition.level} <span aria-hidden="true">·</span> {competition.format} <span aria-hidden="true">·</span> {competition.eligibility}
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_68px] gap-3 border-l border-[#DEDACF] pl-3 dark:border-[#343B30]">
          <div className="min-w-0">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#646458] dark:text-[#B7BBAE]">{deadlineFieldLabel(competition)}</span>
            <p className="mt-1 text-[12px] font-semibold leading-4 text-[#34362F] dark:text-[#EAE8E0]">{period}</p>
            {signal && <p className={`mt-1 text-[11px] leading-4 ${signalClass}`}>{signal}</p>}
          </div>
          <div className="min-w-0 border-l border-[#DEDACF] pl-2.5 dark:border-[#343B30]">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#646458] dark:text-[#B7BBAE]">Biaya</span>
            <p className="mt-1 text-[12px] font-semibold leading-4 text-[#34362F] dark:text-[#EAE8E0]">{formatCurrency(competition.fee)}</p>
          </div>
        </div>
        {accordion && <Chevron rotated={expanded} />}
      </div>
    </>
  );
}

export function CompetitionListItem({ competition, today, variant, isExpanded = false, onToggle, children }: Props) {
  const accordion = variant === "accordion";
  const interactive = accordion || Boolean(competition.detailPath);
  const id = `competition-details-${competition.id}`;
  const sharedClass = `group min-w-0 border border-[#D8D3C6] bg-[#F8F7F1] transition-[border-color,background-color] duration-200 motion-reduce:transition-none dark:border-[#343B30] dark:bg-[#1A1D19] ${interactive ? "hover:border-[#65745A] hover:bg-[#F4F3EB] dark:hover:border-[#829374] dark:hover:bg-[#20271E]" : ""}`;
  const rowClass = "block w-full min-w-0 px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] sm:px-4 lg:p-0";
  const summary = <CompetitionSummary competition={competition} today={today} accordion={accordion} expanded={isExpanded} />;

  if (accordion) {
    return (
      <article className={`${sharedClass} ${isExpanded ? "border-[#65745A] dark:border-[#829374]" : ""}`}>
        <button type="button" aria-expanded={isExpanded} aria-controls={id} onClick={() => onToggle?.(competition.id)} className={`${rowClass} cursor-pointer`}>
          {summary}
        </button>
        {isExpanded && (
          <div id={id} className="border-t border-[#D8D3C6] bg-[#F0EEE5] px-3 py-3.5 dark:border-[#343B30] dark:bg-[#1D241B] sm:px-4">
            {children}
          </div>
        )}
      </article>
    );
  }

  if (competition.detailPath) {
    return (
      <article className={sharedClass}>
        <Link href={competition.detailPath} className={`${rowClass} cursor-pointer`} aria-label={`Lihat detail ${competition.title}`}>
          {summary}
        </Link>
      </article>
    );
  }

  // There is no /katalog/[id] in the original source; do not invent a clickable target.
  return <article className={sharedClass}><div className={rowClass}>{summary}</div></article>;
}
