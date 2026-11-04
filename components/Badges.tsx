import { Severity, Status } from "@/lib/types";

const sev: Record<Severity, string> = {
  Minor: "text-minor border-minor",
  Moderate: "text-moderate border-moderate",
  Critical: "text-critical border-critical",
};
const st: Record<Status, string> = {
  New: "text-critical border-critical",
  Alerted: "text-moderate border-moderate",
  Resolved: "text-minor border-minor",
};
const base = "inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold";

export const SeverityBadge = ({ value }: { value: Severity }) => <span className={`${base} ${sev[value]}`}>{value}</span>;
export const StatusBadge = ({ value }: { value: Status }) => <span className={`${base} ${st[value]}`}>{value}</span>;
