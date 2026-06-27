'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Calendar, Send } from 'lucide-react';
import { getAccessToken } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { useCreateCampaignMutation, useLaunchCampaignMutation } from '@/services/campaign.api';

interface StepTwoActionsProps {
	allFilled: boolean;
	campaignData?: any;
}

export function StepTwoActions({
	allFilled,
	campaignData,
}: StepTwoActionsProps) {
	const router = useRouter();
	const [createCampaign] = useCreateCampaignMutation();
	const [launchCampaign] = useLaunchCampaignMutation();
	const [isSending, setIsSending] = useState(false);
	const [isScheduling, setIsScheduling] = useState(false);

	console.log("🎯 StepTwoActions - campaignData:", campaignData); // ✅ Debug log

	const handleSendNow = async () => {
		const token = getAccessToken();
		if (!token) {
			toast.error('Please login to continue');
			router.push('/login');
			return;
		}

		if (!allFilled) {
			toast.warning('Please complete all steps before sending');
			return;
		}

		// ✅ Check if templateId exists
		if (!campaignData?.templateId) {
			toast.error('Please select a template first');
			console.error("❌ No templateId in campaignData:", campaignData);
			return;
		}

		setIsSending(true);
		try {
			const campaign = await createCampaign({
				...campaignData,
				scheduledAt: null,
			}).unwrap();

			await launchCampaign(campaign.id).unwrap();

			toast.success('Campaign sent successfully!');
			router.push('/campaigns');
		} catch (error: any) {
			console.error('Send error:', error);
			toast.error(error?.data?.message || 'Failed to send campaign');
		} finally {
			setIsSending(false);
		}
	};

	const handleScheduleLater = async () => {
		const token = getAccessToken();
		if (!token) {
			toast.error('Please login to continue');
			router.push('/login');
			return;
		}

		if (!allFilled) {
			toast.warning('Please complete all steps before scheduling');
			return;
		}

		if (!campaignData?.templateId) {
			toast.error('Please select a template first');
			return;
		}

		const defaultDate = new Date();
		defaultDate.setDate(defaultDate.getDate() + 7);
		const scheduledAt = defaultDate.toISOString();

		setIsScheduling(true);
		try {
			await createCampaign({
				...campaignData,
				scheduledAt: scheduledAt,
			}).unwrap();

			toast.success(`Campaign scheduled for ${defaultDate.toLocaleDateString()}`);
			router.push('/campaigns');
		} catch (error: any) {
			console.error('Schedule error:', error);
			toast.error(error?.data?.message || 'Failed to schedule campaign');
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