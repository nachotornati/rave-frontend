"use client";

import { useMemo, useState } from "react";
import { startOfDay, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { EventsByMonth } from "@/components/events-by-month";
import { EventPublicSheet } from "@/components/event-public-sheet";
import { useEvents } from "@/lib/api/hooks";
import type { Event } from "@/lib/api/types";

const CITY_ORDER = [
  "Buenos Aires",
  "Córdoba",
  "Mendoza",
  "Rosario",
  "Santa Fe",
  "Costa Argentina",
  "Bahía Blanca",
  "Provincia de Mendoza",
];

function FilterChips({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value === value ? null : o.value)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            value === o.value
              ? "bg-white text-black"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function PublicPage() {
  const [selected, setSelected] = useState<Event | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);

  const { data: events = [], isLoading } = useEvents({
    from: startOfDay(new Date()).toISOString(),
  });

  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      if (e.city) set.add(e.city);
    }
    return Array.from(set)
      .sort((a, b) => {
        const ia = CITY_ORDER.indexOf(a);
        const ib = CITY_ORDER.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b, "es");
      })
      .map((c) => ({ value: c, label: c }));
  }, [events]);

  const monthOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const e of events) {
      seen.add(format(parseISO(e.startAt), "yyyy-MM"));
    }
    // Always include current month
    seen.add(format(new Date(), "yyyy-MM"));
    return Array.from(seen)
      .sort()
      .map((key) => ({
        value: key,
        label: format(parseISO(`${key}-01`), "MMMM", { locale: es }).replace(/^\w/, (c) => c.toUpperCase()),
      }));
  }, [events]);

  const filteredEvents = useMemo(
    () =>
      events.filter((e) => {
        if (cityFilter && e.city !== cityFilter) return false;
        if (monthFilter && format(parseISO(e.startAt), "yyyy-MM") !== monthFilter) return false;
        return true;
      }),
    [events, cityFilter, monthFilter]
  );

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight">Rave Agenda</h1>
              <p className="text-xs text-white/40">Eventos de música electrónica</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <FilterChips
              options={cityOptions}
              value={cityFilter}
              onChange={setCityFilter}
            />
            <FilterChips
              options={monthOptions}
              value={monthFilter}
              onChange={setMonthFilter}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-xl px-4 py-6">
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <EventsByMonth
            events={filteredEvents}
            onSelect={setSelected}
            forceCurrentMonth={monthFilter === null}
          />
        )}
      </main>

      {/* Event detail (bottom sheet) */}
      <EventPublicSheet event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
