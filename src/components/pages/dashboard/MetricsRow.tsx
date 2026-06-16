import { MetricCard } from "@/components/ui/MetricCard";
import type { MetricCard as MetricCardType } from "@/types/dashboard";

interface MetricsRowProps {
  metrics: MetricCardType[];
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <div className="flex items-center gap-3 self-stretch max-md:flex-col">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} data={metric} />
      ))}
    </div>
  );
}