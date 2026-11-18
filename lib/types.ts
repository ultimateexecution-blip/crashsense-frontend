export type Severity = "Minor" | "Moderate" | "Critical";
export type Status = "New" | "Alerted" | "Resolved";
export type ResourceType = "hospital" | "police" | "fire";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  lat: number;
  lng: number;
  phone: string;
}

export interface NearbyResource extends Resource {
  distanceKm: number;
}

export interface SmsRecord {
  to: string;
  resourceName: string;
  status: "sent" | "failed" | "queued";
  sentAt: string; // ISO
}

export interface Accident {
  id: string;
  timestamp: string; // ISO
  camera: string;
  locationName: string;
  lat: number;
  lng: number;
  confidence: number; // 0-100
  severity: Severity;
  status: Status;
  vehicles: number;
  imageUrl?: string;
  videoUrl?: string | null;
  nearbyResources: NearbyResource[];
  sms: SmsRecord[];
}
