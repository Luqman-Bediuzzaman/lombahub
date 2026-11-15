import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Icon } from "@/components/icons";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

export function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "dark"; size?: "sm" | "md" | "lg" }) {
  return <button className={`button button-${variant} button-${size} ${className}`} {...props}>{children}</button>;
}

export function LinkButton({ href, children, variant = "primary", size = "md", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "dark"; size?: "sm" | "md" | "lg"; className?: string }) {
  return <Link href={href} className={`button button-${variant} button-${size} ${className}`}>{children}</Link>;
}

export function Badge({ children, tone = "neutral", dot = false }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue" | "dark"; dot?: boolean }) {
  return <span className={`badge badge-${tone}`}>{dot && <i/>}{children}</span>;
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

export function EmptyState({ icon = "compass", title, description, action }: { icon?: "compass" | "bookmark" | "search" | "layers" | "file"; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-state-icon"><Icon name={icon} size={23}/></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function Metric({ label, value, note, icon }: { label: string; value: string | number; note?: string; icon: "compass" | "bookmark" | "clock" | "checkCircle" | "scale" }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><Icon name={icon} size={17}/></div><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}
