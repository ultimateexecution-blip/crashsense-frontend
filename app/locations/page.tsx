"use client";
import { useState } from "react";
import { addResource, getResources, RESOURCE_TYPES } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { Loading, ErrorBox } from "@/components/States";
import Map from "@/components/Map";
import { ResourceType } from "@/lib/types";

export default function Locations() {
  const { data, error, loading, reload } = useAsync(getResources);
  const [form, setForm] = useState({ name: "", type: "hospital" as ResourceType, lat: "", lng: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error ?? "No data"} retry={reload} />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(form.lat), lng = parseFloat(form.lng);
    if (!form.name.trim() || !form.phone.trim() || isNaN(lat) || isNaN(lng)) { setMsg("Fill in every field. Latitude and longitude must be numbers."); return; }
    setSaving(true);
    try {
      await addResource({ name: form.name.trim(), type: form.type, lat, lng, phone: form.phone.trim() });
      setForm({ name: "", type: "hospital", lat: "", lng: "", phone: "" });
      setMsg("Location registered.");
      reload();
    } catch (err) { setMsg((err as Error).message); } finally { setSaving(false); }
  };
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });
  const center: [number, number] = data.length ? [data[0].lat, data[0].lng] : [17.385, 78.4867];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Registered locations</h1>
      <p className="mb-4 text-slate-600">Hospitals, police and fire stations that receive SMS alerts. The nearest ones are linked to each accident automatically.</p>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <section className="card">
          <Map center={center} resources={data} height={340} />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full whitespace-nowrap text-sm">
              <thead><tr className="text-left text-slate-500"><th className="py-2">Name</th><th>Type</th><th>Phone</th></tr></thead>
              <tbody>{data.map((r) => (
                <tr key={r.id} className="border-t border-slate-100"><td className="py-2 font-medium">{r.name}</td><td className="capitalize">{r.type}</td><td>{r.phone}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <form onSubmit={submit} className="card h-fit space-y-3" noValidate>
          <h2 className="font-semibold">Register a new location</h2>
          <label className="block text-sm font-medium">Name<input className="input mt-1" value={form.name} onChange={set("name")} /></label>
          <label className="block text-sm font-medium">Type
            <select className="input mt-1 capitalize" value={form.type} onChange={set("type")}>
              {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">Latitude<input className="input mt-1" inputMode="decimal" value={form.lat} onChange={set("lat")} placeholder="17.4239" /></label>
            <label className="block text-sm font-medium">Longitude<input className="input mt-1" inputMode="decimal" value={form.lng} onChange={set("lng")} placeholder="78.4983" /></label>
          </div>
          <label className="block text-sm font-medium">Phone (receives SMS)<input className="input mt-1" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" /></label>
          <button className="btn btn-primary w-full" disabled={saving}>{saving ? "Saving…" : "Register location"}</button>
          {msg && <p role="status" className="text-sm text-slate-600">{msg}</p>}
        </form>
      </div>
    </>
  );
}
