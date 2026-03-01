"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Event } from "@/lib/api/types";

const schema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  startAt: z.string().min(1, "La fecha de inicio es obligatoria"),
  endAt: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  allDay: z.boolean().optional(),
  status: z.enum(["PROXIMO", "FINALIZADO"]).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  event?: Event;
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  showStatus?: boolean;
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}

// datetime-local gives "2026-03-15T20:00" — backend needs OffsetDateTime ("2026-03-15T20:00:00Z")
function toIsoWithOffset(local?: string): string | undefined {
  if (!local) return undefined;
  return new Date(local).toISOString();
}

export function EventForm({ event, onSubmit, isLoading, showStatus }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      startAt: toDatetimeLocal(event?.startAt),
      endAt: toDatetimeLocal(event?.endAt),
      location: event?.location ?? "",
      imageUrl: event?.imageUrl ?? "",
      allDay: event?.allDay ?? false,
      status: event?.status,
    },
  });

  function handleSubmit(values: FormValues) {
    onSubmit({
      ...values,
      imageUrl: values.imageUrl || undefined,
      startAt: toIsoWithOffset(values.startAt) ?? values.startAt,
      endAt: toIsoWithOffset(values.endAt),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inicio</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fin (opcional)</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lugar</FormLabel>
              <FormControl>
                <Input placeholder="Club, venue, ciudad..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showStatus && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PROXIMO">Próximo</SelectItem>
                    <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Guardando..." : event ? "Actualizar evento" : "Crear evento"}
        </Button>
      </form>
    </Form>
  );
}
