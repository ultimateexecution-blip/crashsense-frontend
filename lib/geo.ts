import { NearbyResource, Resource } from "./types";

// Haversine distance in km. Used only in sample-data mode; the real backend does this server-side.
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat), dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearest(lat: number, lng: number, resources: Resource[], count = 3): NearbyResource[] {
  return resources
    .map((r) => ({ ...r, distanceKm: Math.round(distanceKm(lat, lng, r.lat, r.lng) * 10) / 10 }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, count);
}
