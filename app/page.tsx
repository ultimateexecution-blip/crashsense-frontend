"use client";
import Link from "next/link";
import { getAccidents } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { Loading, ErrorBox } from "@/components/States";
import { SeverityBadge, StatusBadge } from "@/components/Badges";
import DayChart from "@/components/DayChart";
import { Accident } from "@/lib/types";

export default function Dashboard() {
  const { data, error, loading, reload } = useAsync(getAccidents);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error ?? "No data"} retry={reload} />;

  const sorted = [...data].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  const count = (f: (a: Accident) => boolean) => data.filter(f).length;
  const stats = [
    { label: "Total detected", value: data.length, border: "border-l-brand" },
    { label: "Waiting for action", value: count((a) => a.status === "New"), border: "border-l-critical" },
    { label: "Critical severity", value: count((a) => a.severity === "Critical"), border: "border-l-critical" },
    { label: "Resolved", value: count((a) => a.status === "Resolved"), border: "border-l-minor" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <p className="mb-5 text-slate-600">Accidents detected by the camera network, classified by severity.</p>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`card border-l-4 ${s.border}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <h2 className="mb-3 font-semibold">Accidents per day</h2>
          <DayChart accidents={data} />
        </section>
        <section className="card overflow-x-auto">
          <h2 className="mb-3 font-semibold">Latest incidents</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500"><th className="py-2">Location</th><th>Severity</th><th>Status</th></tr></thead>
            <tbody>
              {sorted.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="py-2"><Link className="font-medium text-brand hover:underline" href={`/incidents/${a.id}`}>{a.locationName}</Link></td>
                  <td><SeverityBadge value={a.severity} /></td>
                  <td><StatusBadge value={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
