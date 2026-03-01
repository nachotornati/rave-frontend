"use client";

import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { EventCard } from "@/components/event-card";
import type { Event } from "@/lib/api/types";

interface Props {
  events: Event[];
  onSelect?: (event: Event) => void;
}

function groupByMonth(events: Event[]): { label: string; events: Event[] }[] {
  const map = new Map<string, Event[]>();

  for (const event of events) {
    const key = format(parseISO(event.startAt), "yyyy-MM");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  }

  return Array.from(map.entries()).map(([key, evs]) => ({
    label: format(parseISO(`${key}-01`), "MMMM yyyy", { locale: es }),
    events: evs.sort(
      (a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime()
    ),
  }));
}

export function EventsByMonth({ events, onSelect }: Props) {
  const grouped = groupByMonth(events);

  if (grouped.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/30 text-sm">No hay eventos próximos</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map(({ label, events: monthEvents }) => (
        <section key={label}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/30 px-1">
            {label}
          </h2>
          <div className="space-y-2">
            {monthEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onSelect?.(event)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
