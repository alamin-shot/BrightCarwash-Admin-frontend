'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/store';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import type { NavbarProps } from '@/types/navigation';

const pageTitles: Record<string, string> = {
	'/dashboard': 'Welcome back',
	'/leads': 'Comprehensive Lead Insights',
	'/payments': 'Overview of All Transactions',
	'/campaigns': 'Campaigns',
	'/staffs': 'Team Management and Access Control',
	'/website-cms': 'Website CMS',
	'/reports': 'Reports',
	'/activity-log': 'Activity Log',
	'/settings': 'Settings',
	'/settings/change-password': 'Change Password',
};

export function Navbar({ onMenuClick }: NavbarProps) {
	const pathname = usePathname();
	const user = useAppSelector((state) => state.auth.user);
	const [avatarError, setAvatarError] = useState(false);

	const title = pageTitles[pathname] || 'Welcome back';

	return (
		<header className='flex w-full h-18 px-3 sm:px-4 lg:px-6 py-5 justify-between items-center border-b border-[#DFE1E7] bg-white sticky top-0 z-30'>
			<div className='flex items-center gap-2 sm:gap-4 flex-1 min-w-0'>
				<Button
					variant='icon'
					onClick={onMenuClick}
					className='flex p-2 items-center rounded-lg border border-[#E8E8E9] bg-white cursor-pointer lg:hidden shrink-0'
					aria-label='Toggle sidebar'
				>
					<Icon name='menu' width={24} height={24} />
				</Button>
				<h1 className='text-[#1B1B1B] font-inter text-base sm:text-lg lg:text-2xl font-medium leading-[150%] tracking-[-0.36px] m-0 truncate'>
					{title}, {user ? `${user.firstName} ${user.lastName}` : 'User'}
				</h1>
			</div>

			<div className='flex items-center gap-1 sm:gap-2 shrink-0'>
				<Button
					variant='icon'
					className='hidden sm:flex p-2 items-center rounded-lg border border-[#E8E8E9] bg-white cursor-pointer'
					aria-label='Search'
				>
					<Icon
						name='search'
						width={20}
						height={20}
						className='lg:w-6 lg:h-6'
					/>
				</Button>

				<Button
					variant='icon'
					className='flex p-2 items-center rounded-lg border border-[#E8E8E9] bg-white cursor-pointer'
					aria-label='Notifications'
				>
					<Icon name='bell' width={20} height={20} className='lg:w-6 lg:h-6' />
				</Button>

				<div className='flex py-1.5 px-1.5 lg:py-1.5 lg:px-1.5 items-center gap-2 lg:gap-4 rounded-lg border border-[#E8E8E9] bg-white'>
					<div className='flex items-center gap-2'>
						<div className='rounded-full overflow-hidden w-7 h-7 lg:w-9 lg:h-9 shrink-0'>
							{!avatarError ? (
								<Image
									src='/images/avatar-placeholder.png'
									alt='User avatar'
									width={36}
									height={36}
									className='w-full h-full object-cover'
									onError={() => setAvatarError(true)}
								/>
							) : (
								<div className='w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-[#B23730] text-white flex items-center justify-center font-inter text-xs lg:text-sm font-medium'>
									{user?.firstName?.charAt(0) || 'U'}
								</div>
							)}
						</div>
						<span className='hidden lg:block text-[#1F274B] font-inter text-xs font-normal leading-[100%] truncate max-w-25'>
							{user?.firstName || 'User'}
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}
