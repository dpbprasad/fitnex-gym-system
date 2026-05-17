'use client';

import { useState, useEffect } from 'react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import TenantConfig from '@/components/TenantConfig';

export default function Home() {
  const [tenantId, setTenantId] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const defaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID;
    if (defaultTenantId) {
      setTenantId(defaultTenantId);
      setIsConfigured(true);
    }
  }, []);

  const handleTenantSubmit = (submittedTenantId: string) => {
    setTenantId(submittedTenantId);
    setIsConfigured(true);
  };

  if (!isConfigured) {
    return <TenantConfig onTenantSubmit={handleTenantSubmit} />;
  }

  return <QRCodeDisplay tenantId={tenantId} />;
}
