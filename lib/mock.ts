import { Accident, Resource, Severity } from "./types";
import { nearest } from "./geo";

export const mockResources: Resource[] = [
  { id: "r1", name: "Gandhi Hospital", type: "hospital", lat: 17.4239, lng: 78.4983, phone: "+91 90000 00001" },
  { id: "r2", name: "Yashoda Hospital, Secunderabad", type: "hospital", lat: 17.4399, lng: 78.5011, phone: "+91 90000 00002" },
  { id: "r3", name: "Osmania General Hospital", type: "hospital", lat: 17.3713, lng: 78.4739, phone: "+91 90000 00003" },
  { id: "r4", name: "Tarnaka Police Station", type: "police", lat: 17.4276, lng: 78.5309, phone: "+91 90000 00004" },
  { id: "r5", name: "Uppal Police Station", type: "police", lat: 17.4057, lng: 78.5591, phone: "+91 90000 00005" },
  { id: "r6", name: "Secunderabad Fire Station", type: "fire", lat: 17.4344, lng: 78.5013, phone: "+91 90000 00006" },
];

const DAY = 86400000;
const seed: [string, number, string, string, number, number, number, Severity, number][] = [
  // id, hoursAgo, camera, location, lat, lng, confidence, severity, vehicles
  ["A-1042", 3, "CAM-02", "Tarnaka Junction", 17.4286, 78.5337, 96, "Critical", 3],
  ["A-1041", 5, "CAM-04", "Secunderabad Station Road", 17.4339, 78.5011, 88, "Moderate", 2],
  ["A-1040", 30, "CAM-01", "ORR Exit 9", 17.3928, 78.5701, 93, "Critical", 4],
  ["A-1039", 44, "CAM-03", "Uppal Ring Road", 17.4054, 78.5594, 74, "Minor", 1],
  ["A-1038", 70, "CAM-02", "Tarnaka Junction", 17.4286, 78.5337, 91, "Moderate", 2],
  ["A-1037", 100, "CAM-04", "Secunderabad Station Road", 17.4339, 78.5011, 82, "Minor", 2],
  ["A-1036", 130, "CAM-01", "ORR Exit 9", 17.3928, 78.5701, 97, "Critical", 3],
  ["A-1035", 150, "CAM-03", "Uppal Ring Road", 17.4054, 78.5594, 79, "Minor", 1],
];

export const mockAccidents: Accident[] = seed.map(([id, h, camera, locationName, lat, lng, confidence, severity, vehicles], i) => ({
  id, camera, locationName, lat, lng, confidence, severity, vehicles,
  timestamp: new Date(Date.now() - h * 3600000).toISOString(),
  status: i === 0 ? "New" : i === 1 ? "Alerted" : "Resolved",
  nearbyResources: nearest(lat, lng, mockResources, 3),
  sms: i === 1
    ? [{ to: "+91 90000 00002", resourceName: "Yashoda Hospital, Secunderabad", status: "sent", sentAt: new Date(Date.now() - 5 * 3600000 + 60000).toISOString() }]
    : [],
}));
