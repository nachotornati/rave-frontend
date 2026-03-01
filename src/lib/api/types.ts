// Auto-generated from openapi.yaml

export type EventStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED";

export type ReminderType = "EMAIL" | "PUSH";

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt?: string | null;
  location?: string | null;
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
  allDay?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string | null;
  startAt?: string;
  endAt?: string | null;
  location?: string | null;
  allDay?: boolean;
  status?: EventStatus;
}

export interface Reminder {
  id: string;
  eventId: string;
  minutesBefore: number;
  type: ReminderType;
  sent: boolean;
  createdAt: string;
}

export interface CreateReminderRequest {
  minutesBefore: number;
  type: ReminderType;
}

export interface ListEventsParams {
  from?: string;
  to?: string;
  status?: EventStatus;
}
