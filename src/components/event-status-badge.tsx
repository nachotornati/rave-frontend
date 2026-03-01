import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/api/types";

const variants: Record<EventStatus, { label: string; className: string }> = {
  SCHEDULED: { label: "Scheduled", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  COMPLETED: { label: "Completed", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, className } = variants[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
