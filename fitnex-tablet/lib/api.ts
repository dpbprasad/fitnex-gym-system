const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getQRToken(tenantId: string): Promise<{ token: string }> {
  const response = await fetch(`${API_URL}/api/v1/attendance/qr-token?tenantId=${tenantId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get QR token');
  }
  
  return response.json();
}
