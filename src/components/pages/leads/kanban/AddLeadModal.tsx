'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { useCreateLeadMutation } from '@/services/leads.api';
import type { LeadDepositStatus } from '@/types/leads';
import { toast } from 'react-toastify';

interface AddLeadModalProps {
	isOpen: boolean;
	onClose: () => void;
	stage?: string;
	stageId?: string;
	borderColor?: string;
}

const stageIdMap: Record<string, string> = {
	new: 'stage_new',
	contracted: 'stage_contracted',
	converted: 'stage_converted',
	lost: 'stage_lost',
};

export function AddLeadModal({
	isOpen,
	onClose,
	stage = 'new',
	stageId = 'stage_new',
	borderColor = '#0098E8',
}: AddLeadModalProps) {
	const [createLead, { isLoading }] = useCreateLeadMutation();
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [service, setService] = useState('');
	const [vehicle, setVehicle] = useState('');
	const [source, setSource] = useState('');
	const [deposit, setDeposit] = useState<number>(0);
	const [depositStatus, setDepositStatus] = useState<LeadDepositStatus>('NONE');
	const [leadStage, setLeadStage] = useState(stage);
	const [leadStageId, setLeadStageId] = useState(stageId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !phone || !email || !service || !vehicle || !source) {
			toast.warning('Please fill all required fields');
			return;
		}
		try {
			await createLead({
				name,
				email,
				phone,
				service,
				vehicle,
				source,
				priority: 'MEDIUM',
				deposit_status: depositStatus,
				stage_id: leadStageId,
				stage: leadStage, // ← new field
			}).unwrap();
			toast.success(`${name} added`);
			setName('');
			setPhone('');
			setEmail('');
			setService('');
			setVehicle('');
			setSource('');
			setDeposit(0);
			setDepositStatus('NONE');
			setLeadStage(stage);
			setLeadStageId(stageId);
			onClose();
		} catch {
			toast.error('Failed to add lead');
		}
	};

	const modalTitle = (
		<div className='flex items-center gap-2'>
			<span
				className='w-3 h-3 rounded-full shrink-0'
				style={{ backgroundColor: borderColor }}
			/>
			<span>Add New Lead</span>
		</div>
	);

	const inputClass =
		'w-full px-4 py-2.5 text-sm font-inter border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all';

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size='lg'>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<div>
					<label
						htmlFor='name'
						className='block text-sm font-medium text-[#1B1B1B] mb-1.5'
					>
						Name *
					</label>
					<input
						id='name'
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						placeholder='Full name'
						className={inputClass}
					/>
				</div>
				<div className='grid grid-cols-2 gap-3'>
					<div>
						<label
							htmlFor='phone'
							className='block text-sm font-medium text-[#1B1B1B] mb-1.5'
						>
							Phone *
						</label>
						<input
							id='phone'
							type='tel'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required
							placeholder='+1 555-0000'
							className={inputClass}
						/>
					</div>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-[#1B1B1B] mb-1.5'
						>
							Email *
						</label>
						<input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder='email@example.com'
							className={inputClass}
						/>
					</div>
				</div>
				<div className='grid grid-cols-2 gap-3'>
					<div>
						<label
							htmlFor='service'
							className='block text-sm font-medium text-[#1B1B1B] mb-1.5'
						>
							Service *
						</label>
						<input
							id='service'
							type='text'
							value={service}
							onChange={(e) => setService(e.target.value)}
							required
							placeholder='Service type'
							className={inputClass}
						/>
					</div>
					<div>
						<label
							htmlFor='vehicle'
							className='block text-sm font-medium text-[#1B1B1B] mb-1.5'
						>
							Vehicle *
						</label>
						<input
							id='vehicle'
							type='text'
							value={vehicle}
							onChange={(e) => setVehicle(e.target.value)}
							required
							placeholder='Vehicle model'
							className={inputClass}
						/>
					</div>
				</div>
				<div className='grid grid-cols-4 gap-3'>
					<div>
						<label className='block text-sm font-medium text-[#1B1B1B] mb-1.5'>
							Source *
						</label>
						<input
							type='text'
							value={source}
							onChange={(e) => setSource(e.target.value)}
							required
							placeholder='Website etc.'
							className={inputClass}
						/>
					</div>
					<div>
						<label
							htmlFor='deposit'
							className='block text-sm font-medium text-[#1B1B1B] mb-1.5'
						>
							Deposit ($)
						</label>
						<input
							id='deposit'
							type='number'
							min='0'
							step='1'
							value={deposit}
							onChange={(e) => setDeposit(Number(e.target.value))}
							placeholder='0'
							className={inputClass}
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-[#1B1B1B] mb-1.5'>
							Status
						</label>
						<FilterDropdown
							label='None'
							options={[
								{ value: 'PAID', label: 'Paid' },
								{ value: 'PENDING', label: 'Pending' },
								{ value: 'REFUNDED', label: 'Refunded' },
								{ value: 'NONE', label: 'None' },
							]}
							value={depositStatus}
							onChange={(val: string) =>
								setDepositStatus(val as LeadDepositStatus)
							}
							fullWidth
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-[#1B1B1B] mb-1.5'>
							Stage
						</label>
						<FilterDropdown
							label='New'
							options={[
								{ value: 'new', label: 'New' },
								{ value: 'contracted', label: 'Contracted' },
								{ value: 'converted', label: 'Converted' },
								{ value: 'lost', label: 'Lost' },
							]}
							value={leadStage}
							onChange={(val: string) => {
								setLeadStage(val);
								setLeadStageId(stageIdMap[val] || val);
							}}
							fullWidth
						/>
					</div>
				</div>
				<div className='flex gap-3 justify-end mt-2 pt-4 border-t border-[#E8E8E9]'>
					<Button
						type='button'
						variant='outline'
						onClick={onClose}
						className='px-6'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						isLoading={isLoading}
						loadingText='Adding…'
						className='px-6 text-white shadow-lg'
						style={{ backgroundColor: borderColor }}
					>
						Add Lead
					</Button>
				</div>
			</form>
		</Modal>
	);
}
