import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/api/types";

const variants: Record<EventStatus, { label: string; className: string }> = {
  PROXIMO: { label: "Próximo", className: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  FINALIZADO: { label: "Finalizado", className: "bg-white/10 text-white/50 border-white/20" },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, className } = variants[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
