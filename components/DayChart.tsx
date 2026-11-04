"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Accident } from "@/lib/types";

export default function DayChart({ accidents }: { accidents: Accident[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
    return { key: d.toDateString(), day: d.toLocaleDateString("en-IN", { weekday: "short" }), count: 0 };
  });
  accidents.forEach((a) => {
    const slot = days.find((d) => d.key === new Date(a.timestamp).toDateString());
    if (slot) slot.count += 1;
  });
  return (
    <div role="img" aria-label="Bar chart of accidents detected per day for the last 7 days" style={{ height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={days}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" name="Accidents" fill="#0f3d5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
