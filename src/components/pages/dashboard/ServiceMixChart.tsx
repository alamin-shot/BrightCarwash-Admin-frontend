import type { ServiceMixItem } from "@/types/dashboard";

interface ServiceMixChartProps {
  data: ServiceMixItem[];
}

export function ServiceMixChart({ data }: ServiceMixChartProps) {
  return (
    <div className="flex w-full max-w-[378px] p-4 flex-col items-center gap-4 rounded-lg border border-[#DFE1E7] bg-white">
      <h3 className="flex justify-between items-center self-stretch text-[#1A1C21] font-inter text-lg font-semibold leading-[130%] tracking-[0.09px]">
        Service mix
      </h3>

      <div className="flex flex-col gap-3 self-stretch">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col gap-1">
            <div className="flex justify-between items-center self-stretch">
              <span className="text-[#1E1E1E] font-inter text-xs font-normal leading-[120%]">
                {item.name}
              </span>
              <span className="text-[#1E1E1E] font-inter text-xs font-normal leading-[120%]">
                {item.percentage}%
              </span>
            </div>
            <div className="flex h-[30px] flex-col justify-center items-start self-stretch rounded-lg border border-[#DFE1E7]/20 bg-[#F8FAFB] relative">
              <div
                className="h-full rounded-lg bg-[#0098E8] relative flex items-center"
                style={{ width: `${item.percentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-[#0098E8] border-1 border-white shadow-sm z-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}