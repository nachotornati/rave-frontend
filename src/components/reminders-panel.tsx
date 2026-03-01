"use client";

import { useState } from "react";
import { Bell, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReminders, useCreateReminder, useDeleteReminder } from "@/lib/api/hooks";
import type { ReminderType } from "@/lib/api/types";

interface Props {
  eventId: string;
}

export function RemindersPanel({ eventId }: Props) {
  const { data: reminders, isLoading } = useReminders(eventId);
  const createReminder = useCreateReminder(eventId);
  const deleteReminder = useDeleteReminder(eventId);

  const [minutes, setMinutes] = useState("30");
  const [type, setType] = useState<ReminderType>("EMAIL");

  async function handleAdd() {
    const min = parseInt(minutes, 10);
    if (isNaN(min) || min < 0) return;
    try {
      await createReminder.mutateAsync({ minutesBefore: min, type });
      toast.success("Reminder added");
      setMinutes("30");
    } catch {
      toast.error("Failed to add reminder");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteReminder.mutateAsync(id);
      toast.success("Reminder removed");
    } catch {
      toast.error("Failed to remove reminder");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
        <Bell className="h-3.5 w-3.5" /> Reminders
      </p>

      {isLoading && (
        <p className="text-xs text-muted-foreground">Loading...</p>
      )}

      {reminders?.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
        >
          <span>
            {r.minutesBefore === 0
              ? "At event time"
              : `${r.minutesBefore} min before`}{" "}
            · <span className="text-muted-foreground">{r.type}</span>
            {r.sent && (
              <span className="ml-2 text-xs text-green-500">✓ sent</span>
            )}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleDelete(r.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          type="number"
          min={0}
          placeholder="min before"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-24"
        />
        <Select value={type} onValueChange={(v) => setType(v as ReminderType)}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="PUSH">Push</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={createReminder.isPending}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
