"use client";

import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  value: string; // "yyyy-MM-dd'T'HH:mm" or ""
  onChange: (val: string) => void;
  placeholder?: string;
}

export function DateTimePicker({ value, onChange, placeholder = "Seleccionar fecha" }: Props) {
  const [open, setOpen] = useState(false);

  const date = value ? parse(value, "yyyy-MM-dd'T'HH:mm", new Date()) : undefined;
  const isDateValid = !!date && isValid(date);
  const timeStr = isDateValid ? format(date!, "HH:mm") : "20:00";
  const dateStr = isDateValid ? format(date!, "yyyy-MM-dd") : "";

  function handleDaySelect(day: Date | undefined) {
    if (!day) return;
    onChange(`${format(day, "yyyy-MM-dd")}T${timeStr}`);
  }

  function handleTimeChange(newTime: string) {
    const base = dateStr || format(new Date(), "yyyy-MM-dd");
    onChange(`${base}T${newTime}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !isDateValid && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isDateValid
            ? format(date!, "d 'de' MMMM yyyy · HH:mm", { locale: es })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isDateValid ? date : undefined}
          onSelect={handleDaySelect}
          locale={es}
          autoFocus
        />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-10">Hora</span>
            <Input
              type="time"
              value={timeStr}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-28"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
