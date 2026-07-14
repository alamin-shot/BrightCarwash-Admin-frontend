'use client';

import { Icon } from '@/components/ui/Icon';

export function EmailListContent() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F0F8FF] flex items-center justify-center mb-6">
                <Icon name="list" width={32} height={32} color="#0098E8" />
            </div>
            <h3 className="text-[#1B1B1B] font-inter text-2xl font-semibold mb-2">
                Email List
            </h3>
            <p className="text-[#777980] font-inter text-base max-w-md">
                This feature is coming soon. You'll be able to manage your email lists here.
            </p>
        </div>
    );
}