"use client";

import { useEffect, useRef } from "react";
import { parseISO, format, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { EventCard } from "@/components/event-card";
import type { Event } from "@/lib/api/types";

interface Props {
  events: Event[];
  onSelect?: (event: Event) => void;
  forceCurrentMonth?: boolean;
}

function groupByMonth(events: Event[], forceCurrentMonth: boolean): { key: string; label: string; events: Event[] }[] {
  const map = new Map<string, Event[]>();

  if (forceCurrentMonth) {
    const currentKey = format(new Date(), "yyyy-MM");
    map.set(currentKey, []);
  }

  for (const event of events) {
    const key = format(parseISO(event.startAt), "yyyy-MM");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, evs]) => ({
      key,
      label: format(parseISO(`${key}-01`), "MMMM yyyy", { locale: es }),
      events: evs.sort(
        (a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime()
      ),
    }));
}

export function EventsByMonth({ events, onSelect, forceCurrentMonth = true }: Props) {
  const grouped = groupByMonth(events, forceCurrentMonth);
  const nearestRef = useRef<HTMLDivElement>(null);

  // First upcoming event from now
  const now = new Date();
  const nearestEventId = events.find((e) => !isBefore(parseISO(e.startAt), now))?.id;

  useEffect(() => {
    if (!nearestRef.current) return;
    const el = nearestRef.current;
    const rect = el.getBoundingClientRect();
    // Only scroll if the event is below the visible area
    if (rect.top > window.innerHeight * 0.7) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [nearestEventId]);

  const hasAnyEvents = events.length > 0;

  if (!hasAnyEvents && grouped.length === 1 && grouped[0].events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/30 text-sm">No hay eventos próximos</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map(({ key, label, events: monthEvents }) => (
        <section key={key}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/30 px-1">
            {label}
          </h2>
          {monthEvents.length === 0 ? (
            <p className="px-1 text-sm text-white/20">Sin eventos este mes</p>
          ) : (
            <div className="space-y-2">
              {monthEvents.map((event) => (
                <div
                  key={event.id}
                  ref={event.id === nearestEventId ? nearestRef : undefined}
                  className={
                    event.id === nearestEventId
                      ? "scroll-mt-24"
                      : undefined
                  }
                >
                  <EventCard
                    event={event}
                    onClick={() => onSelect?.(event)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
