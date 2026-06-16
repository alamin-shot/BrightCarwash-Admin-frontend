import { Icon } from "@/components/ui/Icon";
import type { MetricCard as MetricCardType } from "@/types/dashboard";

interface MetricCardProps {
  data: MetricCardType;
}

export function MetricCard({ data }: MetricCardProps) {
  const isPositive = data.changeDirection === "up";

  return (
    <div className="flex p-3 flex-col items-start gap-3 flex-1 rounded-lg border border-[#DFE1E7] bg-white">
      <span className="text-[#777980] font-geist text-sm font-normal leading-[150%] tracking-[-0.21px] self-stretch">
        {data.heading}
      </span>

      <span className="text-[#0B1220] font-lora text-2xl font-medium leading-[130%] tracking-[-0.72px] self-stretch">
        {data.value}
      </span>

      <div className="h-px self-stretch bg-[#E8E8E9]" />

      <div className="flex justify-between items-center self-stretch">
        <div className="flex items-center gap-1">
          <Icon
            name={isPositive ? "rise" : "fall"}
            width={16}
            height={16}
          />
          <span className={`text-sm font-medium ${isPositive ? "text-[#006F1F]" : "text-[#FF4345]"}`}>
            {isPositive ? "+" : ""}
            {data.changePercent}
          </span>
        </div>
        <span className="text-[#777980] font-inter text-sm font-normal leading-[150%] tracking-[-0.21px]">
          {data.vsLabel}
        </span>
      </div>
    </div>
  );
}