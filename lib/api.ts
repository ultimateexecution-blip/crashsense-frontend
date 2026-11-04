/**
 * The ONLY file that talks to the backend.
 * - NEXT_PUBLIC_API_URL empty  -> sample data (demo mode)
 * - NEXT_PUBLIC_API_URL set    -> real Flask API (see README for the endpoint list)
 * If your Flask routes or JSON field names differ, adjust them here and nowhere else.
 */
import { Accident, Resource, ResourceType, Status } from "./types";
import { mockAccidents, mockResources } from "./mock";
import { nearest } from "./geo";

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
export const isMock = !BASE;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}) for ${path}`);
  return res.json();
}

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));
// In-memory copies so demo-mode actions (alert, resolve, add location) stick while the tab is open.
const accidents: Accident[] = structuredClone(mockAccidents);
const resources: Resource[] = structuredClone(mockResources);

export async function getAccidents(): Promise<Accident[]> {
  if (isMock) { await wait(); return [...accidents]; }
  return http<Accident[]>("/accidents");
}

export async function getAccident(id: string): Promise<Accident> {
  if (isMock) {
    await wait();
    const a = accidents.find((x) => x.id === id);
    if (!a) throw new Error("Incident not found");
    return { ...a };
  }
  return http<Accident>(`/accidents/${id}`);
}

/** Sends SMS to the given registered locations (or the nearest ones if none are given). */
export async function sendAlert(id: string, resourceIds?: string[]): Promise<Accident> {
  if (isMock) {
    await wait(600);
    const a = accidents.find((x) => x.id === id)!;
    const targets = a.nearbyResources.filter((r) => !resourceIds || resourceIds.includes(r.id));
    targets.forEach((r) => a.sms.push({ to: r.phone, resourceName: r.name, status: "sent", sentAt: new Date().toISOString() }));
    if (a.status === "New") a.status = "Alerted";
    return { ...a };
  }
  return http<Accident>(`/accidents/${id}/alert`, { method: "POST", body: JSON.stringify({ resourceIds }) });
}

export async function setStatus(id: string, status: Status): Promise<Accident> {
  if (isMock) {
    await wait();
    const a = accidents.find((x) => x.id === id)!;
    a.status = status;
    return { ...a };
  }
  return http<Accident>(`/accidents/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function getResources(): Promise<Resource[]> {
  if (isMock) { await wait(); return [...resources]; }
  return http<Resource[]>("/resources");
}

export async function addResource(r: Omit<Resource, "id">): Promise<Resource> {
  if (isMock) {
    await wait();
    const created = { ...r, id: `r${Date.now()}` };
    resources.push(created);
    accidents.forEach((a) => { a.nearbyResources = nearest(a.lat, a.lng, resources, 3); });
    return created;
  }
  return http<Resource>("/resources", { method: "POST", body: JSON.stringify(r) });
}

export const RESOURCE_TYPES: ResourceType[] = ["hospital", "police", "fire"];
