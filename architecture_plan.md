FitneX: Architectural Blueprint - Version 1.0
1. Architectural Vision & Core Principles
Our design is guided by the following principles to meet the specified constraints:

API-First Design: The backend will be a stateless RESTful and WebSocket API. This decouples the backend logic from the frontend clients (Tablet and Mobile), allowing them to be developed, updated, and even replaced independently.
Multi-Tenant Data Isolation: All primary data models will be strictly partitioned by a tenant_id. This is a non-negotiable security and data integrity measure, ensuring one gym's data is never exposed to another.
Secure-by-Design: Security is not an afterthought. We will use industry-standard practices for authentication (JWT), data-in-transit (TLS/SSL), and secure token generation for the QR code system to prevent replay attacks.
Event-Driven for Asynchronous Tasks: Non-critical, long-running, or external processes (like sending emails and generating PDFs) will be handled asynchronously via a message queue. This makes the user-facing API calls fast and resilient; a failure in the email system will not cause a payment entry to fail.
Transactional Integrity for Financials: The General Ledger will be built on the principles of double-entry bookkeeping, enforced at the database level using transactions to ensure that every financial event is balanced and auditable.

2. High-Level System Components Diagram
This diagram illustrates the primary components and their interactions.
graph TD
    subgraph "Frontend Clients"
        Tablet_UI["Tablet Kiosk (Web App/PWA)"]
        Mobile_UI["Staff Mobile App (Web App/PWA)"]
    end

    subgraph "Backend Infrastructure (Cloud or On-Premise)"
        API["FitneX API Gateway & Backend Logic (Node.js/Express)"]
        WS["WebSocket Server (for Real-time Events)"]
        MQ["Message Queue (e.g., Redis Pub/Sub or RabbitMQ)"]
        DB["PostgreSQL Database"]
    end

    subgraph "Asynchronous Workers"
        EmailWorker["Email & PDF Worker"]
    end

    subgraph "External Services"
        EmailService["Email Service (e.g., SendGrid, Mailgun)"]
    end

    Tablet_UI -- "HTTP/REST (Request QR)" --> API
    API -- "WebSocket Push (New QR)" --> Tablet_UI
    API -- "WebSocket Push (Alerts)" --> Tablet_UI

    Mobile_UI -- "HTTP/REST (All Business Logic)" --> API
    Mobile_UI -- "Scans QR, sends token" --> API

    API -- "Writes/Reads Data" --> DB
    API -- "Publishes 'payment.processed' event" --> MQ

    MQ -- "Consumes 'payment.processed' event" --> EmailWorker
    EmailWorker -- "Generates PDF & Sends Email" --> EmailService


3. Backend Architecture: Technology Stack & Scaffolding
Technology Stack:
Runtime/Framework: Node.js with Express.js (Excellent for I/O-heavy, real-time applications).
Database: PostgreSQL (Robust, ACID-compliant, perfect for relational and financial data).
Real-time Communication: ws library or Socket.IO for WebSocket management.
Message Queue: Redis (using its Pub/Sub feature for simplicity) or RabbitMQ (for more complex routing).
Authentication: JSON Web Tokens (JWT).
PDF Generation: pdf-lib or Puppeteer for server-side PDF creation.
Directory Scaffolding (Monorepo Structure): fitnex-backend/
├── src/
│   ├── api/                # Express route definitions
│   │   ├── auth.routes.js
│   │   ├── tenant.routes.js
│   │   ├── member.routes.js
│   │   ├── attendance.routes.js
│   │   ├── billing.routes.js
│   │   └── reports.routes.js
│   ├── config/             # Environment variables, database config
│   ├── controllers/        # Request/Response logic for routes
│   ├── services/           # Core business logic (e.g., FinancialService, QRService)
│   ├── models/             # Database schemas/models (e.g., using Sequelize or Prisma)
│   ├── workers/            # Asynchronous job processors (e.g., emailWorker.js)
│   ├── utils/              # Helper functions (e.g., crypto, pdfGenerator)
│   ├── middleware/         # Express middleware (e.g., isAuthenticated, isTenantAdmin)
│   └── real-time/          # WebSocket server logic
├── package.json
└── .env.example

4. Database Schema (PostgreSQL)
This schema provides the relational foundation for the entire system.
-- Represents a single gym/business entity
CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Central table for all people: owners, staff, and members
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE, -- Each user belongs to a tenant
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'staff', 'member')), -- Role within the tenant
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defines the membership status and validity for a member
CREATE TABLE memberships (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Active', 'Unpaid', 'Frozen')),
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs every check-in and check-out event
CREATE TABLE attendance_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('check-in', 'check-out')),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Chart of Accounts for the General Ledger
CREATE TABLE gl_accounts (
    account_id SERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL, -- e.g., 'Cash-on-Hand', 'Subscription Revenue'
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
    -- A normal balance of Debit or Credit
    normal_balance VARCHAR(10) NOT NULL CHECK (normal_balance IN ('Debit', 'Credit'))
);

-- The core of the double-entry system. Each row is a balanced transaction.
CREATE TABLE gl_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    debit_account_id INTEGER REFERENCES gl_accounts(account_id),
    credit_account_id INTEGER REFERENCES gl_accounts(account_id),
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    -- Optional: Link to the source of the transaction
    source_reference_id UUID -- e.g., could be a payment_id
);

-- Stores records of payments made by members
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID REFERENCES memberships(membership_id),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    processed_by_user_id UUID REFERENCES users(user_id), -- Staff who processed it
    created_at TIMESTAMPTZ DEFAULT NOW()
);

5. API Endpoints & Routing Layout (/api/v1)
Auth
POST /auth/register: Gym owner registers a new tenant and owner account.
POST /auth/login: Any user (owner, staff, member) logs in, receives a JWT.
Tenants (Requires 'owner' role)
POST /tenants/{tenantId}/staff: Create a new staff user.
GET /tenants/{tenantId}/staff: List all staff members.
Members (Requires 'staff' or 'owner' role)
POST /tenants/{tenantId}/members: Enroll a new member.
GET /tenants/{tenantId}/members: Get a list of all members.
GET /tenants/{tenantId}/members/{memberId}: Get details of a single member.
PUT /tenants/{tenantId}/members/{memberId}/status: Update a member's status (e.g., to 'Frozen').
Attendance & QR Code
GET /attendance/qr-token: [Tablet Only] Authenticates itself and requests to join the WebSocket room for its tenant.
POST /attendance/validate: [Staff Mobile] Staff app sends the scanned JWT from the QR code for validation. The backend performs all gatekeeper logic here.
Billing (Requires 'staff' or 'owner' role)
POST /tenants/{tenantId}/payments: Staff records a cash payment for a member. This is the trigger for the event-driven flow.
Reports (Requires 'owner' role)
GET /tenants/{tenantId}/reports/income-statement?from=...&to=...: Generates a P&L.
GET /tenants/{tenantId}/reports/ar-aging: Shows members with 'Unpaid' status and for how long.
GET /tenants/{tenantId}/reports/traffic?from=...&to=...: Generates member traffic analytics.
Communications (Requires 'owner' or 'staff' role)
POST /tenants/{tenantId}/communications/send: Sends promotional emails or newsletters to member segments.

6. Key Architectural Flows: Deconstructed
Flow 1: Secure QR Code Check-In

Tablet Starts Up: The Tablet UI authenticates with the backend (e.g., using a pre-configured API key for the device) and establishes a WebSocket connection. It joins a room specific to its tenant_id (e.g., ws.join('tenant_abc-123')).
Backend Generates Token: On the server, a setInterval loop runs every 15 seconds for that tenant's room.
Token Creation: Inside the loop, it creates a JWT payload: { tenantId: '...', type: 'check-in', iat: <now>, exp: <now + 15s> }.
Token Signing: The payload is signed with a secret key known only to the server, creating a secure, short-lived token.
WebSocket Push: The server pushes this new JWT down the WebSocket to the tablet.
Tablet Renders QR: The tablet's frontend library (e.g., qrcode.react) receives the new token and instantly re-renders the QR code image.
Staff Scans: The staff member uses the mobile app to scan the QR code, extracting the JWT string.
Validation: The mobile app sends this JWT to the POST /api/v1/attendance/validate endpoint.
Backend Verification: The backend verifies the JWT's signature and checks that it has not expired. If either fails, it returns a 401 Unauthorized error. If it succeeds, it proceeds to the Gatekeeper Logic.
Flow 2: Event-Driven Cash Payment

Staff Input: A staff member submits a form on the mobile app to record a cash payment for a member.
API Call: The app makes a POST /api/v1/tenants/{tenantId}/payments call with the member's ID and the amount.
Database Transaction (Atomic): The backend controller initiates a database transaction.
It inserts a new record into the payments table.
It triggers the Double-Entry Bookkeeping Logic (see Flow 3).
It updates the member's status in the memberships table to 'Active' and sets the valid_until date.
If all steps succeed, the transaction is committed. If any fail, it's rolled back, ensuring data consistency.
Publish Event: After the transaction is successfully committed, the API publishes a message to the message queue (e.g., Redis Pub/Sub channel payments:processed) with a payload like { paymentId: '...', userId: '...', tenantId: '...' }. The API then immediately returns a 201 Created response to the staff mobile app. The user-facing part is complete and fast.
Asynchronous Worker: A separate EmailWorker process, subscribed to the payments:processed channel, receives the message.
Job Processing: The worker fetches the full payment and member details from the database using the IDs in the payload. It generates a PDF receipt, and uses an external email service to send the receipt to the member's email address.
Flow 3: Double-Entry Bookkeeping Logic

Trigger: This logic is called internally during the Cash Payment Flow's database transaction.
Identify Accounts: The FinancialService identifies the correct gl_accounts for the tenant:
Debit Account: 'Cash-on-Hand' (account_type: 'Asset').
Credit Account: 'Subscription Revenue' (account_type: 'Revenue').
Create Journal Entry: It creates a single, balanced entry in the gl_transactions table:
description: "Cash payment for membership renewal - Member John Doe."
amount: The payment amount.
debit_account_id: The ID for 'Cash-on-Hand'.
credit_account_id: The ID for 'Subscription Revenue'.
This atomic insert ensures that no money is ever created or destroyed, only moved between accounts.
