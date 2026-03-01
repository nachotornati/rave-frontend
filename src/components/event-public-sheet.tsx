"use client";

import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EventStatusBadge } from "@/components/event-status-badge";
import type { Event } from "@/lib/api/types";

interface Props {
  event: Event | null;
  onClose: () => void;
}

export function EventPublicSheet({ event, onClose }: Props) {
  if (!event) return null;

  const start = parseISO(event.startAt);
  const end = event.endAt ? parseISO(event.endAt) : null;

  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85dvh] overflow-y-auto px-0 pb-8"
      >
        {/* Cover image */}
        {event.imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-5">
          <SheetHeader className="pb-2 text-left">
            <div className="flex items-start justify-between gap-3 pt-4">
              <SheetTitle className="text-xl font-bold leading-tight text-white">
                {event.title}
              </SheetTitle>
              <EventStatusBadge status={event.status} />
            </div>
          </SheetHeader>

          <Separator className="my-4 bg-white/10" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-white/70">
              <CalendarDays className="h-4 w-4 shrink-0 text-white/40" />
              <span>
                {event.allDay
                  ? format(start, "EEEE, d 'de' MMMM", { locale: es })
                  : format(start, "EEEE, d 'de' MMMM · HH:mm", { locale: es })}
              </span>
            </div>

            {end && (
              <div className="flex items-center gap-3 text-white/70">
                <Clock className="h-4 w-4 shrink-0 text-white/40" />
                <span>Finaliza a las {format(end, "HH:mm")}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-white/40" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <>
              <Separator className="my-4 bg-white/10" />
              <p className="text-sm text-white/60 leading-relaxed">
                {event.description}
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
