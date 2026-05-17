const WebSocket = require('ws');
const QRService = require('../services/QRService');

class WebSocketServer {
  constructor(port) {
    this.port = port;
    this.wss = null;
    this.tenantRooms = new Map();
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });

    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const tenantId = url.searchParams.get('tenantId');

      if (!tenantId) {
        ws.close(1008, 'Tenant ID required');
        return;
      }

      ws.tenantId = tenantId;

      if (!this.tenantRooms.has(tenantId)) {
        this.tenantRooms.set(tenantId, new Set());
      }

      this.tenantRooms.get(tenantId).add(ws);

      console.log(`WebSocket client connected for tenant: ${tenantId}`);

      this.startQRTokenBroadcast(tenantId);

      ws.on('close', () => {
        const room = this.tenantRooms.get(tenantId);
        if (room) {
          room.delete(ws);
          if (room.size === 0) {
            this.tenantRooms.delete(tenantId);
            this.stopQRTokenBroadcast(tenantId);
          }
        }
        console.log(`WebSocket client disconnected for tenant: ${tenantId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for tenant ${tenantId}:`, error);
      });
    });

    console.log(`WebSocket server running on port ${this.port}`);
  }

  startQRTokenBroadcast(tenantId) {
    if (this.tenantIntervals.has(tenantId)) {
      return;
    }

    const interval = setInterval(() => {
      const room = this.tenantRooms.get(tenantId);
      if (!room || room.size === 0) {
        this.stopQRTokenBroadcast(tenantId);
        return;
      }

      const token = QRService.generateCheckInToken(tenantId);

      room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new-qr-token',
            token,
            timestamp: new Date()
          }));
        }
      });
    }, 15000);

    this.tenantIntervals.set(tenantId, interval);
  }

  stopQRTokenBroadcast(tenantId) {
    const interval = this.tenantIntervals.get(tenantId);
    if (interval) {
      clearInterval(interval);
      this.tenantIntervals.delete(tenantId);
    }
  }

  broadcastToTenant(tenantId, message) {
    const room = this.tenantRooms.get(tenantId);
    if (room) {
      room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }
}

WebSocketServer.prototype.tenantIntervals = new Map();

module.exports = WebSocketServer;
