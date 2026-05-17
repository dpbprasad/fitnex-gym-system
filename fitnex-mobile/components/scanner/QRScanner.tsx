'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiClient } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface QRScannerProps {
  onScanSuccess?: (result: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-scanner';

  const handleScan = async (data: string) => {
    if (data && !validating) {
      setResult(data);
      setValidating(true);
      setValidationResult(null);

      const response = await apiClient.validateQRToken(data);
      
      if (response.success && response.data) {
        setValidationResult(response.data);
        if (response.data.success && onScanSuccess) {
          onScanSuccess(data);
        }
      }

      setValidating(false);
    }
  };

  const startScanner = async () => {
    try {
      scannerRef.current = new Html5Qrcode(scannerElementId);
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {}
      );
      setScanning(true);
    } catch (error) {
      console.error('QR Scanner error:', error);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [scanning]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">QR Code Scanner</h3>
        <p className="text-gray-600 text-sm">Scan member's QR code for check-in</p>
      </div>

      {!scanning ? (
        <Button onClick={startScanner} className="w-full">
          Start Scanner
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <div id={scannerElementId} className="w-full rounded-lg overflow-hidden" />
          </div>

          <Button onClick={stopScanner} variant="secondary" className="w-full">
            Stop Scanner
          </Button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Scanned:</span> {result.substring(0, 20)}...
          </p>
        </div>
      )}

      {validating && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Validating token...
        </div>
      )}

      {validationResult && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            validationResult.success
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <p className="text-sm font-medium">{validationResult.message}</p>
        </div>
      )}
    </Card>
  );
}
