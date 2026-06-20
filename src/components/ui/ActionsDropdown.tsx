'use client';

import { useState, useRef, useEffect } from 'react';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ActionItem {
	label: string;
	onClick: () => void;
	variant?: 'default' | 'danger';
}

interface ActionsDropdownProps {
	items: ActionItem[];
}

export function ActionsDropdown({ items }: ActionsDropdownProps) {
	const [open, setOpen] = useState(false);
	const [dropUp, setDropUp] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	useEffect(() => {
		if (open && menuRef.current) {
			const rect = menuRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			setDropUp(spaceBelow < 160 && rect.top > 160);
		}
	}, [open]);

	return (
		<div ref={ref} className='relative'>
			<Button
				variant='icon'
				onClick={() => setOpen(!open)}
				className='flex p-1.5 items-center gap-3 rounded-md border border-[#E8E8E9] bg-white cursor-pointer hover:bg-[#F8FAFB]'
			>
				<Ellipsis size={16} className='text-[#777980]' />
			</Button>

			{open && (
				<div
					ref={menuRef}
					className={`absolute right-0 w-40 bg-white rounded-lg border border-[#E8E8E9] shadow-lg z-20 overflow-hidden ${
						dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
					}`}
				>
					{items.map((item) => (
						<Button
							key={item.label}
							variant='icon'
							onClick={() => {
								item.onClick();
								setOpen(false);
							}}
							className={`flex w-full py-2.5 px-4 items-center text-sm text-left cursor-pointer transition-colors ${
								item.variant === 'danger'
									? 'text-[#FF4345] hover:bg-[#FFE6E6]'
									: 'text-[#1B1B1B] hover:bg-[#F8FAFB]'
							}`}
						>
							{item.label}
						</Button>
					))}
				</div>
			)}
		</div>
	);
}
