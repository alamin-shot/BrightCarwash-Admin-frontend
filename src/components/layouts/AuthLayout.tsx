'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { LoginFooter } from '@/components/pages/auth-pages/login/LoginFooter';

interface AuthLayoutProps {
	title: string;
	subtitle: string;
	children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
	const [imgError, setImgError] = useState(false);
	const [imgSrc, setImgSrc] = useState('/images/login-bg.png');

	return (
		<div className='flex h-screen overflow-hidden bg-[#0B1220]'>
			{/* Left panel */}
			<div className='flex w-full lg:max-w-[650px] flex-col items-start self-stretch overflow-y-auto'>
				<div className='flex px-4 sm:px-6 lg:px-8 py-3 sm:py-4 justify-between items-center self-stretch'>
					<Image
						src='/images/logo.png'
						alt='Logo'
						width={40}
						height={48}
						className='object-contain sm:w-[50px] sm:h-[57px] lg:w-[57px] lg:h-[64px]'
						unoptimized
					/>
					<LanguageSelector />
				</div>

				<div className='flex px-5 sm:px-8 lg:px-10 py-10 sm:py-14 lg:py-20 flex-col justify-center items-center gap-6 sm:gap-8 flex-1 self-stretch'>
					<div className='flex flex-col gap-2 self-stretch'>
						<h1 className='text-white font-inter text-2xl sm:text-[28px] lg:text-[32px] font-semibold leading-[130%]'>
							{title}
						</h1>
						<p className='text-[#E9E9EA] font-inter text-xs sm:text-sm font-normal leading-[160%]'>
							{subtitle}
						</p>
					</div>
					{children}
				</div>

				<LoginFooter />
			</div>

			{/* Right panel */}
			<div className='flex-1 relative hidden lg:block'>
				{!imgError ? (
					<Image
						src={imgSrc}
						alt='Dashboard preview'
						fill
						className='object-cover'
						priority
						unoptimized
						onError={(error) => {
							console.error('[AuthLayout] Image loading error:', error);
							console.log('[AuthLayout] Attempting fallback image...');
							// Try fallback to Dashboard.png if login-bg.png fails
							if (imgSrc === '/images/login-bg.png') {
								console.log('[AuthLayout] Switching to Dashboard.png fallback');
								setImgSrc('/images/Dashboard.png');
							} else {
								// If fallback also fails, show gradient
								console.log(
									'[AuthLayout] Fallback also failed, showing gradient',
								);
								setImgError(true);
							}
						}}
					/>
				) : (
					<div className='absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#1a2a3a] to-[#0B1220]' />
				)}
				<div className='absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/20 to-transparent' />
			</div>
		</div>
	);
}
