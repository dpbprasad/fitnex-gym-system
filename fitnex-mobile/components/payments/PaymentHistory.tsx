'use client';

import { Payment } from '@/types/api';
import Card from '@/components/ui/Card';

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
}

export default function PaymentHistory({ payments, loading }: PaymentHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No payments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Membership #{payment.membershipId}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{payment.paymentMethod}</span>
                <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
