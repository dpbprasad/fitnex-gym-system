# FitneX Project Logbook - Architecture Map

## Project Overview
FitneX is a gym management system with multi-tenant architecture, consisting of:
- Backend API (Node.js/Express)
- Tablet Kiosk Web App (PWA for member check-in)
- Staff Mobile Web App (PWA for staff operations)

## Current State
**Backend:** ✅ COMPLETED
- Location: `fitnex-backend/`
- All 12 backend implementation tasks completed
- Database schema, models, services, API routes, WebSocket server, message queue worker all implemented
- Build compilation verified (all files pass syntax checks)

**Frontend:** ✅ COMPLETED
- Tablet Kiosk Web App: Scaffolding completed, build verified
- Staff Mobile Web App: Scaffolding completed, build verified

## Target Multi-Platform Directory Architecture

```
Forge_Projects/
├── fitnex-backend/                    # ✅ COMPLETED
│   ├── src/
│   │   ├── api/                       # Express route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── tenant.routes.js
│   │   │   ├── member.routes.js
│   │   │   ├── attendance.routes.js
│   │   │   ├── billing.routes.js
│   │   │   └── reports.routes.js
│   │   ├── config/                    # Environment & database config
│   │   │   ├── database.js
│   │   │   ├── index.js
│   │   │   └── migrate.js
│   │   ├── controllers/               # Request/response logic
│   │   │   ├── authController.js
│   │   │   ├── tenantController.js
│   │   │   ├── memberController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── billingController.js
│   │   │   └── reportsController.js
│   │   ├── services/                   # Core business logic
│   │   │   ├── FinancialService.js
│   │   │   └── QRService.js
│   │   ├── models/                    # Database models (Sequelize)
│   │   │   ├── Tenant.js
│   │   │   ├── User.js
│   │   │   ├── Membership.js
│   │   │   ├── AttendanceLog.js
│   │   │   ├── GLAccount.js
│   │   │   ├── GLTransaction.js
│   │   │   ├── Payment.js
│   │   │   └── index.js
│   │   ├── workers/                    # Async job processors
│   │   │   └── emailWorker.js
│   │   ├── utils/                      # Helper functions
│   │   │   └── crypto.js
│   │   ├── middleware/                 # Express middleware
│   │   │   └── auth.js
│   │   ├── real-time/                 # WebSocket server logic
│   │   │   └── websocket.js
│   │   ├── app.js                     # Express app configuration
│   │   └── server.js                  # Server entry point
│   ├── package.json
│   └── .env.example
│
├── fitnex-tablet/                     # ⏳ TO BE CREATED - Tablet Kiosk Web App
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout with PWA configuration
│   │   ├── page.tsx                   # QR code display page
│   │   ├── globals.css                # Global styles
│   │   └── api/                       # API routes (if needed for proxy)
│   ├── components/                    # React components
│   │   ├── QRCodeDisplay.tsx          # QR code display with WebSocket
│   │   ├── TenantConfig.tsx           # Tenant ID configuration
│   │   └── LoadingSpinner.tsx         # Loading state component
│   ├── lib/                           # Utility libraries
│   │   ├── websocket.ts               # WebSocket client logic
│   │   └── api.ts                     # API client functions
│   ├── public/                        # Static assets
│   │   ├── manifest.json              # PWA manifest
│   │   ├── favicon.ico
│   │   └── icons/                     # App icons
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js                 # PWA configuration
│   └── .env.local                     # Environment variables
│
├── fitnex-mobile/                     # ⏳ TO BE CREATED - Staff Mobile Web App
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout with PWA configuration
│   │   ├── page.tsx                   # Login page
│   │   ├── login/
│   │   │   └── page.tsx               # Login form
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Main dashboard
│   │   ├── members/
│   │   │   ├── page.tsx               # Member list
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Member details
│   │   ├── payments/
│   │   │   └── page.tsx               # Payment processing
│   │   ├── reports/
│   │   │   └── page.tsx               # Reports dashboard
│   │   └── globals.css                # Global styles
│   ├── components/                    # React components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx          # Login form component
│   │   │   └── AuthGuard.tsx          # Route protection
│   │   ├── members/
│   │   │   ├── MemberList.tsx         # Member list component
│   │   │   ├── MemberCard.tsx         # Member card component
│   │   │   └── CreateMemberForm.tsx   # Create member form
│   │   ├── payments/
│   │   │   ├── PaymentForm.tsx        # Payment processing form
│   │   │   └── PaymentHistory.tsx     # Payment history display
│   │   ├── reports/
│   │   │   ├── IncomeStatement.tsx    # Income statement chart
│   │   │   ├── TrafficAnalytics.tsx   # Traffic analytics chart
│   │   │   └── ARAging.tsx            # AR aging report
│   │   ├── scanner/
│   │   │   └── QRScanner.tsx          # QR code scanner component
│   │   └── ui/                        # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Modal.tsx
│   ├── lib/                           # Utility libraries
│   │   ├── api.ts                     # API client functions
│   │   ├── auth.ts                    # Authentication utilities
│   │   └── storage.ts                 # Local storage utilities
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts                 # Authentication hook
│   │   ├── useMembers.ts              # Members data hook
│   │   └── usePayments.ts             # Payments data hook
│   ├── types/                         # TypeScript type definitions
│   │   ├── api.ts                     # API response types
│   │   ├── auth.ts                    # Authentication types
│   │   └── models.ts                  # Data model types
│   ├── public/                        # Static assets
│   │   ├── manifest.json              # PWA manifest
│   │   ├── favicon.ico
│   │   └── icons/                     # App icons
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js                 # PWA configuration
│   └── .env.local                     # Environment variables
│
└── logbook.md                         # This file - Architecture map
```

## Technology Stack Summary

### Backend (Completed)
- Runtime: Node.js with Express.js
- Database: PostgreSQL with Sequelize ORM
- Authentication: JWT with bcryptjs
- Real-time: WebSocket (ws library)
- Message Queue: Redis Pub/Sub
- PDF Generation: pdf-lib

### Frontend - Tablet Kiosk (Pending)
- Framework: Next.js 14+ with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- PWA: next-pwa or custom manifest
- WebSocket: Native WebSocket API
- QR Code: qrcode.react or similar

### Frontend - Staff Mobile (Pending)
- Framework: Next.js 14+ with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- PWA: next-pwa or custom manifest
- QR Scanner: react-qr-reader or similar
- Charts: recharts or chart.js for reports
- State Management: React Context or Zustand

## Implementation Phases

### Phase 1: Backend ✅ COMPLETED
- [x] Directory structure
- [x] Database schema and models
- [x] Authentication middleware
- [x] Core services (Financial, QR)
- [x] API routes and controllers
- [x] WebSocket server
- [x] Message queue worker
- [x] Build verification

### Phase 2: Tablet Kiosk Web App ✅ COMPLETED
- [x] Next.js project initialization
- [x] PWA configuration
- [x] QR code display component
- [x] WebSocket integration
- [x] Tenant configuration UI
- [x] Build verification

### Phase 3: Staff Mobile Web App ✅ COMPLETED
- [x] Next.js project initialization
- [x] PWA configuration
- [x] Authentication flow
- [x] Member management UI
- [x] QR scanner integration
- [x] Payment processing UI
- [x] Reports dashboard
- [x] Build verification

### Phase 4: Integration & Testing ⏳ PENDING
- [ ] End-to-end testing
- [ ] PWA testing on devices
- [ ] WebSocket connection testing
- [ ] Multi-tenant data isolation verification
- [ ] Performance optimization

## Software Engineering Patterns Documented

### Backend Patterns (Implemented)
1. **Layered Architecture**: Clear separation between routes, controllers, services, models
2. **Multi-Tenant Data Isolation**: All data models partitioned by tenant_id
3. **Event-Driven Architecture**: Async processing via Redis message queue
4. **Double-Entry Bookkeeping**: Financial integrity enforced at database level
5. **JWT Authentication**: Token-based authentication with role-based access control
6. **WebSocket Real-Time**: Tenant-based room management for QR code broadcasting

### Frontend Patterns (To Be Implemented)
1. **Component-Based Architecture**: Reusable React components with clear separation
2. **Custom Hooks Pattern**: Encapsulated logic for data fetching and state management
3. **TypeScript Type Safety**: Strong typing for API responses and component props
4. **PWA Pattern**: Progressive Web App for offline capability and native-like experience
5. **Responsive Design**: Mobile-first approach using Tailwind CSS
6. **State Management**: Context API or Zustand for global state

## Environment Variables Required

### Backend (.env)
- PORT, NODE_ENV
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET, JWT_EXPIRES_IN
- REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
- EMAIL_SERVICE, EMAIL_API_KEY, EMAIL_FROM
- PDF_TEMP_DIR
- WS_PORT

### Tablet Kiosk (.env.local)
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_WS_URL
- NEXT_PUBLIC_DEFAULT_TENANT_ID

### Staff Mobile (.env.local)
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_WS_URL

## Next Steps
**Phase 4: Integration & Testing**
1. Set up PostgreSQL database and run migrations
2. Configure Redis for message queue
3. Start backend server and WebSocket server
4. Start frontend development servers
5. Test end-to-end user flows:
   - Staff login and authentication
   - Member creation and management
   - QR code generation and scanning
   - Payment processing
   - Report generation
6. Verify multi-tenant data isolation
7. Test PWA installation and offline capability
8. Performance optimization and load testing

---
**STATUS:** SCAFFOLDING COMPLETE - READY FOR INTEGRATION & TESTING
