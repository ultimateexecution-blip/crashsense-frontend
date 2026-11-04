"use client";
import dynamic from "next/dynamic";

// Leaflet touches `window`, so it must only load in the browser.
const Map = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-lg bg-slate-200" />,
});
export default Map;
