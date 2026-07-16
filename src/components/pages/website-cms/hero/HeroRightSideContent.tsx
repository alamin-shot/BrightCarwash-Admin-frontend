"use client";

import { HeroStatusSelector } from './HeroStatusSelector';
import { Icon } from "@/components/ui/Icon"


interface HeroRightSideContentProps {
    status: 'form' | 'banner' | 'hidden';
    onStatusChange: (status: 'form' | 'banner' | 'hidden') => void;
}

export function HeroRightSideContent({ status, onStatusChange }: HeroRightSideContentProps) {
    return (
        <div className="p-6 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col gap-4">
            <span className="text-[#1B1B1B] text-xl font-medium leading-6">Right Side Content</span>
            <HeroStatusSelector status={status} onChange={onStatusChange} />

            {status === 'form' && (
                <div className="p-4 bg-[#EBF5FF] rounded-lg border border-[#0098E8] flex flex-col gap-2">
                    <span className="text-[#1B1B1B] text-lg font-medium leading-4">Booking Form active</span>
                    <p className="text-[#777980] text-sm font-normal leading-6">
                        Shows vehicle select, name, date, phone, and email fields. The primary button label is used as the submit button.
                    </p>
                </div>
            )}

            {status === 'banner' && (
                <div className="flex flex-col gap-2">
                    <label className="text-[#777980] font-inter text-base font-normal leading-5">Banner Image</label>
                    <div className="h-64 bg-white rounded-lg border-2 border-dashed border-[#DFE1E7] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#0098E8] transition-colors">
                        <Icon name="upload" width={32} height={32} color="#A5A5AB" />
                        <div className="text-center">
                            <p className="text-[#777980] text-base font-medium leading-5">Upload your files here, or simply drag and drop them into this area.</p>
                            <p className="text-[#A5A5AB] text-sm font-normal leading-5">PNG, JPG, and WebP formats</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" />
                    </div>
                </div>
            )}

            {status === 'hidden' && (
                <div className="p-4 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col items-center justify-center gap-2 py-8">
                    <Icon name="eye-off" width={32} height={32} color="#A5A5AB" />
                    <p className="text-[#777980] font-inter text-sm">This section is hidden from the public.</p>
                </div>
            )}
        </div>
    );
}