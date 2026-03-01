import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "./client";
import type { CreateEventRequest, EventStatus, UpdateEventRequest } from "./types";

export function useEvents(params?: { from?: string; to?: string; status?: EventStatus }) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.list(params),
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
