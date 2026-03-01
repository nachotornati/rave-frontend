import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi, remindersApi } from "./client";
import type {
  CreateEventRequest,
  CreateReminderRequest,
  EventStatus,
  UpdateEventRequest,
} from "./types";

// ── Events ────────────────────────────────────────────────────────────────────

export function useEvents(params?: {
  from?: string;
  to?: string;
  status?: EventStatus;
}) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.list(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => eventsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEventRequest) => eventsApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEventRequest }) =>
      eventsApi.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

// ── Reminders ─────────────────────────────────────────────────────────────────

export function useReminders(eventId: string) {
  return useQuery({
    queryKey: ["reminders", eventId],
    queryFn: () => remindersApi.list(eventId),
    enabled: !!eventId,
  });
}

export function useCreateReminder(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReminderRequest) =>
      remindersApi.create(eventId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders", eventId] }),
  });
}

export function useDeleteReminder(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.delete(eventId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders", eventId] }),
  });
}
