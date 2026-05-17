'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { WebSocketClient } from '@/lib/websocket';

interface QRCodeDisplayProps {
  tenantId: string;
}

export default function QRCodeDisplay({ tenantId }: QRCodeDisplayProps) {
  const [qrToken, setQrToken] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!tenantId) {
      setError('Tenant ID is required');
      return;
    }

    const wsClient = new WebSocketClient(tenantId);

    wsClient.connect((data) => {
      if (data.type === 'new-qr-token') {
        setQrToken(data.token);
        setIsConnected(true);
        setError('');
      }
    });

    return () => {
      wsClient.disconnect();
    };
  }, [tenantId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-gray-600">Connecting to server...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FitneX Check-In</h1>
          <p className="text-gray-600">Scan the QR code to check in</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            {qrToken && (
              <QRCode
                value={qrToken}
                size={250}
                level="H"
                includeMargin={true}
              />
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">QR code updates every 15 seconds</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by FitneX Gym Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
