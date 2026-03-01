export type EventStatus = "PROXIMO" | "FINALIZADO";

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  allDay: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string | null;
  startAt: string;
  endAt?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  allDay?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string | null;
  startAt?: string;
  endAt?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  allDay?: boolean;
  status?: EventStatus;
}

export interface ListEventsParams {
  from?: string;
  to?: string;
  status?: EventStatus;
}
