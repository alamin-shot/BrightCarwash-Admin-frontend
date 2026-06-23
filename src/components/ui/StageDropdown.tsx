'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { CreateStageModal } from '@/components/pages/leads/CreateStageModal';

export interface StageOption {
	value: string;
	label: string;
	color: string;
	stageId: string;
}

interface StageDropdownProps {
	currentStage: string;
	stages: StageOption[];
	onSelect: (stageName: string) => void;
	onStageCreated?: () => void;
}

const defaultIcon = 'new';
const defaultColor = '#0098E8';

function hexToTintedBg(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

function getIconName(stage: StageOption): string {
	const label = stage.label.toLowerCase();
	if (label.includes("new")) return "new";
	if (label.includes("contract")) return "contract";
	if (label.includes("convert")) return "convert";
	if (label.includes("lost")) return "lost";
	// Default fallback — never return undefined
	return "new";
}

export function StageDropdown({
	currentStage,
	stages,
	onSelect,
	onStageCreated,
}: StageDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [dropUp, setDropUp] = useState(false);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	useEffect(() => {
		if (open && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			setDropUp(spaceBelow < 220 && rect.top > 220);
		}
	}, [open]);

	const currentOption = stages.find((s) => s.value === currentStage);
	const currentColor = currentOption?.color || defaultColor;
	const iconName = currentOption ? getIconName(currentOption) : defaultIcon;
	const tintedBg = hexToTintedBg(currentColor);

	const handleCreated = () => {
		setCreateModalOpen(false);
		if (onStageCreated) onStageCreated();
	};

	return (
		<div ref={ref} className='relative inline-block'>
			<Button
				variant='icon'
				onClick={() => setOpen(!open)}
				className='inline-flex py-1.5 pl-2 pr-1 justify-center items-center gap-1 rounded text-sm capitalize cursor-pointer'
				style={{ backgroundColor: tintedBg, color: currentColor }}
			>
				<Icon name={iconName} width={14} height={14} color={currentColor} />
				{currentOption?.label || currentStage}
				<ChevronDown size={12} style={{ color: currentColor, opacity: 0.7 }} />
			</Button>

			{open && (
				<div
					ref={dropdownRef}
					className={`absolute left-0 w-44 bg-white rounded-lg border border-[#E8E8E9] shadow-lg z-20 overflow-hidden ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
						}`}
				>
					{stages.map((stage) => (
						<Button
							key={stage.stageId}
							variant='icon'
							onClick={() => { onSelect(stage.label); setOpen(false); }}
							className={`flex w-full py-2.5 px-4 items-center gap-2 text-sm capitalize cursor-pointer transition-colors ${stage.value === currentStage
								? 'bg-[#0098E8] text-white'
								: 'text-[#1B1B1B] hover:bg-[#F8FAFB]'
								}`}
						>
							<Icon
								name={getIconName(stage)}
								width={14}
								height={14}
								color={
									stage.value === currentStage
										? '#FFFFFF'
										: stage.color || defaultColor
								}
							/>
							{stage.label}
						</Button>
					))}
					<Button
						variant='icon'
						className='flex w-full py-2.5 px-4 items-center justify-center text-[#0098E8] font-inter text-sm border-t border-[#E8E8E9] hover:bg-[#F0F8FF] cursor-pointer'
						onClick={() => {
							setOpen(false);
							setCreateModalOpen(true);
						}}
					>
						Create new Stage
					</Button>
				</div>
			)}

			<CreateStageModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onCreated={handleCreated}
			/>
		</div>
	);
}
