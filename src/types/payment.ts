export interface Payment {
	id: string;
	customerName: string;
	customerAvatar: string;
	service: string;
	transactionId: string;
	amount: number;
	status: 'PAID' | 'PENDING' | 'REFUNDED';
	date: string;
}

export interface PaymentMetrics {
	id: string;
	heading: string;
	value: string;
	changePercent: string;
	changeDirection: 'up' | 'down';
	vsLabel: string;
}

export interface PaymentDashboardData {
	metrics: PaymentMetrics[];
	payments: Payment[];
}
