'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Calendar, Send } from 'lucide-react';
import { getAccessToken } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { useCreateCampaignMutation, useLaunchCampaignMutation } from '@/services/campaign.api';
import { ScheduleModal } from '@/components/pages/campaigns/create/modals/ScheduleModal';
import type { CreateCampaignRequest } from '@/types/campaign';
import { PERMISSIONS } from '@/lib/permissions';

interface StepTwoActionsProps {
	allFilled: boolean;
	campaignData?: {
		name: string;
		tags: string[];
		subject: string;
		templateId: string;
		leadGroupId: string | null | undefined;
	};
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
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

	const buildPayload = (overrides: Partial<CreateCampaignRequest> = {}): CreateCampaignRequest => ({
		name: campaignData?.name || '',
		tags: campaignData?.tags || [],
		subject: campaignData?.subject || '',
		templateId: campaignData?.templateId || '',
		leadGroupId: campaignData?.leadGroupId || '',
		...overrides,
	});

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

		if (!campaignData?.templateId) {
			toast.error('Please select a template first');
			return;
		}

		setIsSending(true);
		try {
			const campaign = await createCampaign(buildPayload({ scheduledAt: null })).unwrap();
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

	const handleScheduleLater = (scheduledAt: string) => {
		setScheduleModalOpen(false);
		handleScheduleCampaign(scheduledAt);
	};

	const handleScheduleCampaign = async (scheduledAt: string) => {
		const token = getAccessToken();
		if (!token) {
			toast.error("Please login to continue");
			router.push("/login");
			return;
		}

		if (!allFilled) {
			toast.warning("Please complete all steps before scheduling");
			return;
		}

		if (!campaignData?.templateId) {
			toast.error("Please select a template first");
			return;
		}

		setIsScheduling(true);
		try {
			const campaign = await createCampaign(buildPayload({ scheduledAt })).unwrap();
			await launchCampaign(campaign.id).unwrap();
			toast.success(`Campaign scheduled for ${new Date(scheduledAt).toLocaleString()}`);
			router.push("/campaigns");
		} catch (error: any) {
			console.error("Schedule error:", error);
			toast.error(error?.data?.message || "Failed to schedule campaign");
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
				permission={PERMISSIONS.campaign.create}
				className='flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!'
			>
				<Send size={16} />
				Send now
			</Button>
			<Button
				onClick={() => setScheduleModalOpen(true)}
				isLoading={isScheduling}
				loadingText='Scheduling...'
				variant='outline'
				permission={PERMISSIONS.campaign.create}
				className='flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm hover:bg-[#F8FAFB] transition-colors w-auto!'
			>
				<Calendar size={16} />
				Schedule for later
			</Button>

			<ScheduleModal
				isOpen={scheduleModalOpen}
				onClose={() => setScheduleModalOpen(false)}
				onSchedule={handleScheduleLater}
				isScheduling={isScheduling}
			/>
		</div>
	);
}