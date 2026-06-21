import Image from 'next/image';
import type { Column } from '@/components/ui/DataTable';
import type { Payment } from '@/types/payment';

const statusStyles: Record<string, string> = {
	PAID: 'text-[#006F1F] border-[#E8E8E9] bg-white',
	PENDING: 'text-[#FFAF00] border-[#E8E8E9] bg-white',
	REFUNDED: 'text-[#FF4345] border-[#E8E8E9] bg-white',
};

export const paymentsColumns: Column<Payment>[] = [
	{
		key: 'checkbox',
		header: (
			<input
				type='checkbox'
				className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]'
			/>
		),
		className: 'w-12',
		render: () => (
			<input
				type='checkbox'
				className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]'
			/>
		),
	},
	{
		key: 'customerName',
		header: 'Customer Name',
		render: (row) => (
			<div className='flex items-center gap-2'>
				<div className='w-6 h-6 rounded-full overflow-hidden border border-white'>
					<Image
						src={row.customerAvatar}
						alt={row.customerName}
						width={24}
						height={24}
						className='object-cover'
					/>
				</div>
				<span className='text-[#1B1B1B] font-inter text-sm truncate max-w-30'>
					{row.customerName}
				</span>
			</div>
		),
	},
	{
		key: 'service',
		header: 'Service',
		render: (row) => (
			<span className='text-[#1B1B1B] font-inter text-sm'>{row.service}</span>
		),
	},
	{
		key: 'transactionId',
		header: 'Transaction ID',
		render: (row) => (
			<span className='text-[#1B1B1B] font-inter text-sm font-mono'>
				{row.transactionId}
			</span>
		),
	},
	{
		key: 'amount',
		header: 'Amount',
		render: (row) => (
			<span className='text-[#1B1B1B] font-inter text-sm font-medium'>
				${row.amount}
			</span>
		),
	},
	{
		key: 'status',
		header: 'Status',
		render: (row) => (
			<span
				className={`inline-flex py-1.5 px-2 justify-center items-center gap-1 rounded border text-sm capitalize ${statusStyles[row.status]}`}
			>
				{row.status}
			</span>
		),
	},
	{
		key: 'date',
		header: 'Date',
		render: (row) => (
			<span className='text-[#1B1B1B] font-inter text-sm'>{row.date}</span>
		),
	},
];
