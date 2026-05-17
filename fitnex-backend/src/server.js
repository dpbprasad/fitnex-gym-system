require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const WebSocketServer = require('./real-time/websocket');
const config = require('./config');

const startServer = async () => {
  try {
    await testConnection();

    const wsServer = new WebSocketServer(config.websocket.port);
    wsServer.start();

    const port = config.port;
    app.listen(port, () => {
      console.log(`FitneX API server running on port ${port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
