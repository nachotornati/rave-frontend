"use client";

import { useMemo, useState } from "react";
import { startOfDay } from "date-fns";
import { EventsByMonth } from "@/components/events-by-month";
import { EventPublicSheet } from "@/components/event-public-sheet";
import { useEvents } from "@/lib/api/hooks";
import type { Event } from "@/lib/api/types";

export default function PublicPage() {
  const [selected, setSelected] = useState<Event | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const { data: events = [], isLoading } = useEvents({
    from: startOfDay(new Date()).toISOString(),
  });

  const cities = useMemo(() => {
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
    const set = new Set<string>();
    for (const e of events) {
      if (e.city) set.add(e.city);
    }
    return Array.from(set).sort((a, b) => {
      const ia = CITY_ORDER.indexOf(a);
      const ib = CITY_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b, "es");
    });
  }, [events]);

  const filteredEvents = useMemo(
    () => (cityFilter ? events.filter((e) => e.city === cityFilter) : events),
    [events, cityFilter]
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
          {/* City filter chips */}
          {cities.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setCityFilter(null)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  cityFilter === null
                    ? "bg-white text-black"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                Todas
              </button>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c === cityFilter ? null : c)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    cityFilter === c
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
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
          <EventsByMonth events={filteredEvents} onSelect={setSelected} />
        )}
      </main>

      {/* Event detail (bottom sheet) */}
      <EventPublicSheet event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
