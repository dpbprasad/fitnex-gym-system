export interface Membership {
  id: number;
  userId: number;
  type: string;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  price: number;
  tenantId: number;
}

export interface GLAccount {
  id: number;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  tenantId: number;
}

export interface GLTransaction {
  id: number;
  date: string;
  description: string;
  debitAccountId: number;
  creditAccountId: number;
  amount: number;
  tenantId: number;
}
