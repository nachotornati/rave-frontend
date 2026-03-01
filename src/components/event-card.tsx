"use client";

import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Clock } from "lucide-react";
import { EventStatusBadge } from "@/components/event-status-badge";
import type { Event } from "@/lib/api/types";

interface Props {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: Props) {
  const start = parseISO(event.startAt);
  const end = event.endAt ? parseISO(event.endAt) : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-colors hover:bg-white/10 active:bg-white/15">
        {/* Cover image */}
        {event.imageUrl && (
          <div className="w-full h-40 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-5 py-4">
          {/* Date badge + info */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-2 min-w-[52px]">
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                {format(start, "MMM", { locale: es })}
              </span>
              <span className="text-2xl font-bold leading-none text-white">
                {format(start, "d")}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white leading-tight truncate">
                  {event.title}
                </h3>
                <EventStatusBadge status={event.status} />
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50">
                {!event.allDay && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(start, "HH:mm")}
                    {end && ` – ${format(end, "HH:mm")}`}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                )}
              </div>

              {event.description && (
                <p className="mt-2 text-sm text-white/40 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
