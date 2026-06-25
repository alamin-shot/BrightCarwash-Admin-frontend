'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Calendar, Send } from 'lucide-react';
import { getAccessToken } from '@/lib/auth-client';
import { toast } from 'react-toastify';

interface StepTwoActionsProps {
	allFilled: boolean;
	onSendNow?: () => void;
	onScheduleLater?: () => void;
}

export function StepTwoActions({
	allFilled,
	onSendNow,
	onScheduleLater,
}: StepTwoActionsProps) {
	const router = useRouter();
	const [isSending, setIsSending] = useState(false);
	const [isScheduling, setIsScheduling] = useState(false);

	const handleSendNow = async () => {
		// ✅ Check if user is logged in
		const token = getAccessToken();
		if (!token) {
			toast.error('Please login to continue');
			router.push('/login');
			return;
		}

		// ✅ Check if all required fields are filled
		if (!allFilled) {
			toast.warning('Please complete all steps before sending');
			return;
		}

		setIsSending(true);
		try {
			await onSendNow?.();
		} finally {
			setIsSending(false);
		}
	};

	const handleScheduleLater = async () => {
		// ✅ Check if user is logged in
		const token = getAccessToken();
		if (!token) {
			toast.error('Please login to continue');
			router.push('/login');
			return;
		}

		// ✅ Check if all required fields are filled
		if (!allFilled) {
			toast.warning('Please complete all steps before scheduling');
			return;
		}

		setIsScheduling(true);
		try {
			await onScheduleLater?.();
		} finally {
			setIsScheduling(false);
		}
	};

	return (
		<div className='flex items-center gap-3'>
			<Button
				onClick={handleSendNow}
				isLoading={isSending}
				loadingText='Sending...'
				className='flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!'
			>
				<Send size={16} />
				Send now
			</Button>
			<Button
				onClick={handleScheduleLater}
				isLoading={isScheduling}
				loadingText='Scheduling...'
				variant='outline'
				className='flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm hover:bg-[#F8FAFB] transition-colors w-auto!'
			>
				<Calendar size={16} />
				Schedule for later
			</Button>
		</div>
	);
}