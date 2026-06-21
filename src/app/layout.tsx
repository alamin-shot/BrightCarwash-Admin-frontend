import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { StoreProvider } from '@/app/StoreProvider';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

export const metadata: Metadata = {
	title: 'Car Wash Admin',
	description: 'Car wash admin dashboard application',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className={inter.variable}>
			<body className='font-sans' style={{ fontFamily: 'Inter, sans-serif' }}>
				<StoreProvider>{children}</StoreProvider>
				<ToastContainer
					position='top-right'
					autoClose={3000}
					hideProgressBar={false}
				/>
			</body>
		</html>
	);
}
