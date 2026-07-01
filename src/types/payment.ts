export interface PaymentStatsData {
	totalRevenue: { value: number; percentage: string; status: 'up' | 'down' };
	paidDeposits: { value: number; percentage: string; status: 'up' | 'down' };
	pending: { value: number; percentage: string; status: 'up' | 'down' };
	failed: { value: number; percentage: string; status: 'up' | 'down' };
}

export interface PaymentStatsResponse {
	success: boolean;
	message: string;
	data: PaymentStatsData;
}

export interface PaymentTransaction {
	id: string;
	transactionId: string;      // from transaction_id
	customerName: string;       // from customer_name
	service: string;
	amount: number;
	currency: string;
	status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED'; // FAILED added
	date: string;               // from created_at
	leadId: string;
}

export interface PaymentTransactionResponse {
	success: boolean;
	message: string;
	data: {
		transactions: {
			id: string;
			transaction_id: string;
			customer_name: string;
			service: string;
			amount: string;          // backend returns string
			currency: string;
			status: string;
			created_at: string;
			updated_at: string;
			lead_id: string;
		}[];
		meta: {
			totalItems: number;
			itemCount: number;
			itemsPerPage: number;
			totalPages: number;
			currentPage: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
		};
	};
}