import { useState, useEffect } from 'react';
import { Payment } from '@/types/api';
import { apiClient } from '@/lib/api';
import { useAuth } from './useAuth';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPayments = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const response = await apiClient.getPayments(user.tenantId.toString());
    
    if (response.success && response.data) {
      setPayments(response.data);
    } else {
      setError(response.error || 'Failed to fetch payments');
    }

    setLoading(false);
  };

  const processPayment = async (data: {
    membershipId: number;
    amount: number;
    paymentMethod: string;
  }) => {
    setLoading(true);
    setError(null);

    const response = await apiClient.processPayment(data);
    
    if (response.success && response.data) {
      setPayments([...payments, response.data]);
    } else {
      setError(response.error || 'Failed to process payment');
    }

    setLoading(false);
    return response;
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    processPayment,
  };
}
