"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMock } from "@/lib/api";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/incidents", label: "Incidents" },
  { href: "/locations", label: "Registered locations" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-brand">CrashSense</Link>
        <nav aria-label="Main" className="flex flex-wrap gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold ${active ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        {isMock && <span className="ml-auto rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Demo data</span>}
      </div>
    </header>
  );
}
