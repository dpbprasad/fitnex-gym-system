export class WebSocketClient {
  private tenantId: string;
  private pollingInterval: NodeJS.Timeout | null = null;
  private apiUrl: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  connect(onMessage: (data: any) => void): void {
    // Use polling instead of WebSocket for Render compatibility
    this.startPolling(onMessage);
  }

  private startPolling(onMessage: (data: any) => void): void {
    // Poll every 15 seconds for new QR token
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.apiUrl}/api/v1/tenants/${this.tenantId}/qr-token`);
        if (response.ok) {
          const data = await response.json();
          onMessage({
            type: 'new-qr-token',
            token: data.token,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 15000);

    // Initial poll
    this.pollOnce(onMessage);
  }

  private async pollOnce(onMessage: (data: any) => void): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/tenants/${this.tenantId}/qr-token`);
      if (response.ok) {
        const data = await response.json();
        onMessage({
          type: 'new-qr-token',
          token: data.token,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Initial poll error:', error);
    }
  }

  disconnect(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
