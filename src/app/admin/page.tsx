"use client";

import { useState } from "react";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventStatusBadge } from "@/components/event-status-badge";
import { EventForm } from "@/components/event-form";
import { Separator } from "@/components/ui/separator";
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/lib/api/hooks";
import type { Event, CreateEventRequest, UpdateEventRequest } from "@/lib/api/types";

export default function AdminPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const sorted = [...events].sort(
    (a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime()
  );

  async function handleCreate(values: CreateEventRequest) {
    try {
      await createEvent.mutateAsync(values);
      toast.success("Evento creado");
      setCreateOpen(false);
    } catch {
      toast.error("Error al crear el evento");
    }
  }

  async function handleUpdate(values: UpdateEventRequest) {
    if (!editingEvent) return;
    try {
      await updateEvent.mutateAsync({ id: editingEvent.id, body: values });
      toast.success("Evento actualizado");
      setEditingEvent(null);
    } catch {
      toast.error("Error al actualizar el evento");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEvent.mutateAsync(id);
      toast.success("Evento eliminado");
    } catch {
      toast.error("Error al eliminar el evento");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Eventos</h2>
          <p className="text-sm text-white/40">{events.length} en total</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear evento</DialogTitle>
            </DialogHeader>
            <EventForm
              onSubmit={handleCreate}
              isLoading={createEvent.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar evento</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSubmit={handleUpdate}
              isLoading={updateEvent.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Events list */}
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/30">
          Todavía no hay eventos. ¡Crea el primero!
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((event) => {
            const start = parseISO(event.startAt);

            return (
              <div
                key={event.id}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Date */}
                  <div className="w-12 shrink-0 text-center">
                    <div className="text-[10px] uppercase tracking-widest text-white/30">
                      {format(start, "MMM", { locale: es })}
                    </div>
                    <div className="text-xl font-bold leading-none">
                      {format(start, "d")}
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-8 bg-white/10" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <div className="flex flex-wrap gap-x-3 text-xs text-white/40 mt-0.5">
                      {!event.allDay && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(start, "HH:mm")}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <EventStatusBadge status={event.status} />

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(event.id)}
                      disabled={deleteEvent.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
