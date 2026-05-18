const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');

const authRoutes = require('./api/auth.routes');
const tenantRoutes = require('./api/tenant.routes');
const memberRoutes = require('./api/member.routes');
const attendanceRoutes = require('./api/attendance.routes');
const billingRoutes = require('./api/billing.routes');
const reportsRoutes = require('./api/reports.routes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'https://fitnex-gym-system-tablet.vercel.app',
    'https://fitnex-gym-system-mobile.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Request body:', JSON.stringify(req.body));
  next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/reports', reportsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
