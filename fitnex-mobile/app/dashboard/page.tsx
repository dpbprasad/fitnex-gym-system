'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import QRScanner from '@/components/scanner/QRScanner';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">FitneX Staff</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <Button onClick={logout} variant="secondary" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-600">Quick actions and overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24</div>
              <div className="text-gray-600">Active Members</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$4,250</div>
              <div className="text-gray-600">Revenue Today</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
              <div className="text-gray-600">Check-ins Today</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-gray-600">Pending Payments</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QRScanner />
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => window.location.href = '/members'}>
                  Manage Members
                </Button>
                <Button className="w-full" variant="secondary" onClick={() => window.location.href = '/payments'}>
                  Process Payments
                </Button>
                <Button className="w-full" variant="secondary" onClick={() => window.location.href = '/reports'}>
                  View Reports
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
