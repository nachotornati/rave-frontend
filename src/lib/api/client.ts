import axios from "axios";
import type { Event, CreateEventRequest, UpdateEventRequest, ListEventsParams } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7070/api",
  headers: { "Content-Type": "application/json" },
});

export const eventsApi = {
  list: (params?: ListEventsParams) =>
    api.get<Event[]>("/events", { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<Event>(`/events/${id}`).then((r) => r.data),

  create: (body: CreateEventRequest) =>
    api.post<Event>("/events", body).then((r) => r.data),

  update: (id: string, body: UpdateEventRequest) =>
    api.put<Event>(`/events/${id}`, body).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/events/${id}`).then((r) => r.data),
};
