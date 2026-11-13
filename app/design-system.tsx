// Shared Jejakarsa design tokens and small UI primitives.
// Keep these values aligned across Base and Katalog.

export const BRAND_DESCRIPTOR = "Direktori kompetisi mahasiswa";

export const JEJAKARSA_STYLES = {
  pageShell:
    "min-h-screen w-full min-w-0 bg-[#F2EFE6] font-sans text-[#2C2C2C] transition-colors duration-300 motion-reduce:transition-none dark:bg-[#161816] dark:text-[#EAE8E0]",
  navbar:
    "sticky top-0 z-50 border-b border-[#DCD8CC] bg-[#F2EFE6]/95 backdrop-blur-md dark:border-[#30382D] dark:bg-[#161816]/95",
  wordmark:
    "font-serif text-[23px] font-bold sm:text-[25px] leading-none tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0]",
  brandDescriptor:
    "mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.12em] sm:text-[8px] sm:tracking-[0.18em] text-[#858174] dark:text-[#9CA392]",
  navigationLink:
    "text-xs font-semibold text-[#5E5E55] transition-colors hover:text-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE6] dark:text-[#9CA392] dark:hover:text-[#A8B79A] dark:focus-visible:ring-offset-[#161816]",
  navigationLinkActive:
    "text-xs font-bold text-[#65745A] underline decoration-[#65745A] decoration-1 underline-offset-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE6] dark:text-[#A8B79A] dark:focus-visible:ring-offset-[#161816]",
  primaryAction:
    "inline-flex min-h-9 items-center justify-center gap-2 bg-[#2C2C2C] px-4 text-[10px] font-bold uppercase tracking-wide text-[#F5F5F0] transition-colors hover:bg-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE6] motion-reduce:transition-none dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35] dark:focus-visible:ring-offset-[#161816]",
  footer:
    "border-t border-[#DCD8CC] bg-[#EAE7DC] dark:border-[#30382D] dark:bg-[#1A1D19]",
} as const;

function CheckMark() {
  return (
    <svg
      className="h-3 w-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function VerificationStatus({ isVerified }: { isVerified: boolean }) {
  return isVerified ? (
    <span
      role="status"
      aria-label="Status sumber: sumber diperiksa"
      className="inline-flex min-w-0 items-center gap-1 text-[10px] font-semibold leading-4 text-[#65745A] dark:text-[#A8B79A]"
    >
      <CheckMark />
      <span>Sumber diperiksa</span>
    </span>
  ) : (
    <span
      role="status"
      aria-label="Status sumber: belum diverifikasi"
      className="inline-flex min-w-0 text-[10px] leading-4 text-[#898679] dark:text-[#9CA392]"
    >
      Belum diverifikasi
    </span>
  );
}
