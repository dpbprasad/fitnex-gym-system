'use client';

import { useState } from 'react';

interface TenantConfigProps {
  onTenantSubmit: (tenantId: string) => void;
}

export default function TenantConfig({ onTenantSubmit }: TenantConfigProps) {
  const [tenantId, setTenantId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantId.trim()) {
      onTenantSubmit(tenantId.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FitneX Kiosk Setup</h1>
          <p className="text-gray-600">Enter your gym's Tenant ID to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 mb-2">
              Tenant ID
            </label>
            <input
              type="text"
              id="tenantId"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="Enter your Tenant ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-secondary transition font-medium"
          >
            Start Kiosk
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Contact your gym administrator for the Tenant ID</p>
          </div>
        </div>
      </div>
    </div>
  );
}
