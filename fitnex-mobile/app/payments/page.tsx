'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { usePayments } from '@/hooks/usePayments';
import PaymentHistory from '@/components/payments/PaymentHistory';
import PaymentForm from '@/components/payments/PaymentForm';
import Button from '@/components/ui/Button';

export default function PaymentsPage() {
  const { logout } = useAuth();
  const { payments, loading, processPayment, fetchPayments } = usePayments();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleProcessPayment = async (data: any) => {
    await processPayment(data);
    fetchPayments();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => window.location.href = '/dashboard'}>
                  ← Back
                </Button>
                <h1 className="text-xl font-bold text-gray-800">Payments</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowPaymentForm(true)} size="sm">
                  + Process Payment
                </Button>
                <Button onClick={logout} variant="secondary" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PaymentHistory
            payments={payments}
            loading={loading}
          />
        </main>

        <PaymentForm
          isOpen={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          onSubmit={handleProcessPayment}
        />
      </div>
    </AuthGuard>
  );
}
