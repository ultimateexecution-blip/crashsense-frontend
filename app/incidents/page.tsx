"use client";
import Link from "next/link";
import { useState } from "react";
import { getAccidents } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { Loading, ErrorBox } from "@/components/States";
import { SeverityBadge, StatusBadge } from "@/components/Badges";

export default function Incidents() {
  const { data, error, loading, reload } = useAsync(getAccidents);
  const [sev, setSev] = useState("");
  const [st, setSt] = useState("");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error ?? "No data"} retry={reload} />;

  const list = data
    .filter((a) => (!sev || a.severity === sev) && (!st || a.status === st))
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
      <p className="mb-4 text-slate-600">Open an incident to see the detected frame, nearby services, and send SMS alerts.</p>
      <div className="mb-3 flex flex-wrap gap-3">
        <select className="input w-auto" aria-label="Filter by severity" value={sev} onChange={(e) => setSev(e.target.value)}>
          <option value="">All severities</option><option>Minor</option><option>Moderate</option><option>Critical</option>
        </select>
        <select className="input w-auto" aria-label="Filter by status" value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="">All statuses</option><option>New</option><option>Alerted</option><option>Resolved</option>
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full whitespace-nowrap text-sm">
          <thead><tr className="text-left text-slate-500">
            <th className="py-2">ID</th><th>Time</th><th>Camera</th><th>Location</th><th>Confidence</th><th>Severity</th><th>Status</th>
          </tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={7} className="py-4 text-slate-500">No incidents match these filters. Clear a filter to see more.</td></tr>}
            {list.map((a) => (
              <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="py-2"><Link className="font-semibold text-brand hover:underline" href={`/incidents/${a.id}`}>{a.id}</Link></td>
                <td>{new Date(a.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                <td>{a.camera}</td><td>{a.locationName}</td><td>{a.confidence}%</td>
                <td><SeverityBadge value={a.severity} /></td><td><StatusBadge value={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
