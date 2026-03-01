"use client";

import { useState } from "react";
import { startOfDay } from "date-fns";
import { EventsByMonth } from "@/components/events-by-month";
import { EventPublicSheet } from "@/components/event-public-sheet";
import { useEvents } from "@/lib/api/hooks";
import type { Event } from "@/lib/api/types";

export default function PublicPage() {
  const [selected, setSelected] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useEvents({
    from: startOfDay(new Date()).toISOString(),
    status: "PROXIMO",
  });

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Rave Agenda</h1>
            <p className="text-xs text-white/40">Eventos de música electrónica</p>
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
          <EventsByMonth events={events} onSelect={setSelected} />
        )}
      </main>

      {/* Event detail (bottom sheet) */}
      <EventPublicSheet event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
