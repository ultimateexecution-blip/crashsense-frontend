# CrashSense Frontend

Next.js 14 + TypeScript + Tailwind dashboard for the accident detection system.
Pages: Dashboard, Incidents, Incident detail (frame, map, nearest services, SMS alerts), Registered locations.

## 1. Run it (demo mode, no backend needed)

```bash
npm install
npm run dev
```
Open http://localhost:3000. With no backend configured it runs on sample data
(you will see a "Demo data" tag in the header). Sending alerts, resolving incidents
and registering locations all work in demo mode until you refresh the page.

## 2. Connect your Flask backend

```bash
cp .env.example .env.local
# edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Restart `npm run dev`. The "Demo data" tag disappears.

Enable CORS on Flask, otherwise the browser blocks the calls:
```python
from flask_cors import CORS
CORS(app)   # pip install flask-cors
```

### Endpoints the frontend expects
All calls live in `lib/api.ts`. If your routes or field names differ, change them there only.

| Method | Path | Returns / does |
|---|---|---|
| GET | `/accidents` | list of Accident |
| GET | `/accidents/:id` | one Accident |
| POST | `/accidents/:id/alert` | body `{ resourceIds?: string[] }`; sends SMS to those registered locations (or the nearest if omitted); returns the updated Accident |
| PATCH | `/accidents/:id` | body `{ status }`; returns the updated Accident |
| GET | `/resources` | list of registered locations |
| POST | `/resources` | body `{ name, type, lat, lng, phone }`; returns the created location |

Accident JSON shape (see `lib/types.ts`):
```json
{
  "id": "A-1042", "timestamp": "2026-10-30T10:42:00Z", "camera": "CAM-02",
  "locationName": "Tarnaka Junction", "lat": 17.4286, "lng": 78.5337,
  "confidence": 96, "severity": "Critical", "status": "New", "vehicles": 3,
  "imageUrl": "https://...",
  "nearbyResources": [{ "id": "r1", "name": "Gandhi Hospital", "type": "hospital",
                         "lat": 17.42, "lng": 78.49, "phone": "+91...", "distanceKm": 1.2 }],
  "sms": [{ "to": "+91...", "resourceName": "Gandhi Hospital", "status": "sent", "sentAt": "2026-10-30T10:43:00Z" }]
}
```
- `severity`: "Minor" | "Moderate" | "Critical"
- `status`: "New" | "Alerted" | "Resolved"
- `type`: "hospital" | "police" | "fire"

SMS is sent by the backend (for example with Twilio or Fast2SMS), never from the browser,
so your API keys stay secret. The frontend only calls the `/alert` endpoint.

## 3. Put it online (shareable link)

1. Push this folder to a GitHub repo.
2. Go to vercel.com, sign in with GitHub, click "Add New Project", and pick the repo.
3. Under Environment Variables add `NEXT_PUBLIC_API_URL` if you have a deployed backend
   (it must be https). Leave it empty to publish the demo-data version.
4. Click Deploy. You get a public URL such as `crashsense.vercel.app`.

A website served over https cannot call an http backend, so deploy Flask somewhere with https
(Render, Railway) before pointing a Vercel site at it.

## Folder guide
- `app/` pages
- `components/` badges, nav, map, chart
- `lib/api.ts` all backend calls (the file to edit when connecting)
- `lib/mock.ts` sample data used in demo mode
