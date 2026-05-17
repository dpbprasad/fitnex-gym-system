'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import IncomeStatement from '@/components/reports/IncomeStatement';
import TrafficAnalytics from '@/components/reports/TrafficAnalytics';
import ARAging from '@/components/reports/ARAging';

export default function ReportsPage() {
  const { logout } = useAuth();

  const mockIncomeStatement = {
    revenue: 12500.00,
    expenses: 8200.00,
    netIncome: 4300.00,
  };

  const mockTrafficAnalytics = {
    totalCheckIns: 156,
    averageDaily: 52.0,
    peakHour: '6:00 PM - 7:00 PM',
  };

  const mockARAging = [
    { memberName: 'John Doe', amount: 150.00, daysOverdue: 15 },
    { memberName: 'Jane Smith', amount: 200.00, daysOverdue: 45 },
    { memberName: 'Bob Johnson', amount: 300.00, daysOverdue: 75 },
  ];

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
                <h1 className="text-xl font-bold text-gray-800">Reports</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={logout} variant="secondary" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncomeStatement {...mockIncomeStatement} />
            <TrafficAnalytics {...mockTrafficAnalytics} />
            <ARAging items={mockARAging} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
