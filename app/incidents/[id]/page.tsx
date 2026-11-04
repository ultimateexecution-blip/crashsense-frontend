"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getAccident, sendAlert, setStatus } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { Loading, ErrorBox } from "@/components/States";
import { SeverityBadge, StatusBadge } from "@/components/Badges";
import Map from "@/components/Map";

const icon = { hospital: "🏥", police: "👮", fire: "🚒" } as const;

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: a, setData, error, loading, reload } = useAsync(() => getAccident(id), [id]);
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  if (loading) return <Loading />;
  if (error || !a) return <ErrorBox message={error ?? "Incident not found"} retry={reload} />;

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2800); };
  const run = async (fn: () => Promise<typeof a>, msg: string) => {
    setBusy(true);
    try { setData(await fn()); flash(msg); } catch (e) { flash((e as Error).message); } finally { setBusy(false); }
  };
  const toggle = (rid: string) => setPicked((p) => (p.includes(rid) ? p.filter((x) => x !== rid) : [...p, rid]));

  return (
    <>
      <Link href="/incidents" className="btn btn-ghost mb-4">← Back to incidents</Link>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="card">
          <h1 className="mb-3 text-lg font-bold">Incident {a.id} · {a.camera}</h1>
          {a.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.imageUrl} alt={`Detected accident frame from ${a.camera}`} className="aspect-video w-full rounded-md bg-slate-800 object-cover" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-md bg-slate-800 text-sm text-slate-300">
              No frame image (the backend returns imageUrl)
            </div>
          )}
          <h2 className="mb-2 mt-5 font-semibold">Map</h2>
          <Map center={[a.lat, a.lng]} accident={{ lat: a.lat, lng: a.lng, label: a.locationName }} resources={a.nearbyResources} />
          <p className="mt-2 text-xs text-slate-500">Red: accident · Green: hospital · Blue: police · Amber: fire station</p>
        </section>

        <div className="space-y-4">
          <section className="card">
            <h2 className="mb-3 font-semibold">Details</h2>
            <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-sm">
              <dt className="text-slate-500">Location</dt><dd className="font-semibold">{a.locationName}</dd>
              <dt className="text-slate-500">Time</dt><dd className="font-semibold">{new Date(a.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</dd>
              <dt className="text-slate-500">Confidence</dt><dd className="font-semibold">{a.confidence}%</dd>
              <dt className="text-slate-500">Vehicles</dt><dd className="font-semibold">{a.vehicles}</dd>
              <dt className="text-slate-500">Severity</dt><dd><SeverityBadge value={a.severity} /></dd>
              <dt className="text-slate-500">Status</dt><dd><StatusBadge value={a.status} /></dd>
            </dl>
          </section>

          <section className="card">
            <h2 className="mb-1 font-semibold">Nearest registered services</h2>
            <p className="mb-3 text-xs text-slate-500">Tick the ones to alert, or alert all three.</p>
            <ul className="space-y-2">
              {a.nearbyResources.map((r) => (
                <li key={r.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-2 text-sm hover:bg-slate-50">
                    <input type="checkbox" checked={picked.includes(r.id)} onChange={() => toggle(r.id)} />
                    <span aria-hidden>{icon[r.type]}</span>
                    <span className="flex-1"><span className="font-semibold">{r.name}</span><br /><span className="text-slate-500">{r.phone}</span></span>
                    <span className="font-semibold">{r.distanceKm} km</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn btn-danger" disabled={busy || picked.length === 0} onClick={() => run(() => sendAlert(a.id, picked), "SMS sent to selected services")}>
                Send SMS to selected
              </button>
              <button className="btn btn-ghost" disabled={busy} onClick={() => run(() => sendAlert(a.id), "SMS sent to all nearby services")}>Alert all nearby</button>
              <button className="btn btn-ghost" disabled={busy || a.status === "Resolved"} onClick={() => run(() => setStatus(a.id, "Resolved"), "Marked as resolved")}>Mark resolved</button>
            </div>
          </section>

          <section className="card">
            <h2 className="mb-2 font-semibold">SMS log</h2>
            {a.sms.length === 0 ? <p className="text-sm text-slate-500">No alerts sent yet.</p> : (
              <ul className="space-y-1 text-sm">
                {a.sms.map((s, i) => (
                  <li key={i} className="flex justify-between gap-2 border-t border-slate-100 pt-1">
                    <span>{s.resourceName} <span className="text-slate-500">({s.to})</span></span>
                    <span className={s.status === "failed" ? "font-semibold text-critical" : "font-semibold text-minor"}>
                      {s.status} · {new Date(s.sentAt).toLocaleTimeString("en-IN", { timeStyle: "short" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      {toast && <div role="status" className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{toast}</div>}
    </>
  );
}
