import type { ServiceMixItem } from "@/types/dashboard";

interface ServiceMixChartProps {
  data: ServiceMixItem[];
}

export function ServiceMixChart({ data }: ServiceMixChartProps) {
  return (
    <div className="w-full h-full p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 rounded-lg border border-[#DFE1E7] bg-white">
      <h3 className="shrink-0 text-[#1A1C21] font-inter text-base sm:text-lg font-semibold leading-[130%] tracking-[0.09px]">
        Service mix
      </h3>

      <div className="flex flex-col gap-2 sm:gap-3 flex-1 justify-center">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col gap-0.5 sm:gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[#1E1E1E] font-inter text-[10px] sm:text-xs font-normal leading-[120%] truncate mr-2">
                {item.name}
              </span>
              <span className="text-[#1E1E1E] font-inter text-[10px] sm:text-xs font-normal leading-[120%] shrink-0">
                {item.percentage}%
              </span>
            </div>
            <div className="flex h-[24px] sm:h-[30px] flex-col justify-center items-start w-full rounded-lg border border-[#DFE1E7]/20 bg-[#F8FAFB] relative">
              <div
                className="h-full rounded-lg bg-[#0098E8] relative flex items-center min-w-[4px]"
                style={{ width: `${item.percentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#0098E8] border-2 border-white shadow-sm z-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}