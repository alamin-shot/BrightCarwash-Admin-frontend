"use client";

import Link from "next/link";
import { ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LeadDetailHeaderProps {
    onAssignClick: () => void;
}

export function LeadDetailHeader({ onAssignClick }: LeadDetailHeaderProps) {
    return (
        <>
            <div className="flex items-center gap-2 text-sm text-[#777980] font-inter">
                <Link href="/leads" className="hover:text-[#0098E8]">
                    Leads
                </Link>
                <ChevronRight size={14} />
                <span className="text-[#1B1B1B]">Lead Detail</span>
            </div>

            <div className="flex justify-between items-start self-stretch">
                <h2 className="text-[#0B1220] font-lora text-xl font-bold leading-[100%]">
                    Lead Details
                </h2>
                <Button
                    className="flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!"
                    onClick={onAssignClick}
                >
                    <UserPlus size={16} />
                    Assign Member
                </Button>
            </div>
        </>
    );
}