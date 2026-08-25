# NexusCRM Enterprise - Full-Stack Customer Relationship Management Platform

NexusCRM is an enterprise-grade, full-stack Customer Relationship Management (CRM) platform designed for scaling B2B organizations, sales teams, and revenue operations. It provides end-to-end management of companies (accounts), contacts, leads, deals, tasks, email communications, and analytics with role-based access control (RBAC), AI-powered deal intelligence, immutable audit trails, and automated testing.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard & Analytics
- **Pipeline Milestone Distribution**: Real-time breakdown of total deal value and opportunity volume by stage.
- **Conversion & Win Rates**: Automated calculations for win rates, average deal cycle velocity, and average deal size.
- **Rep Quota Leaderboard**: Real-time sales rep quota attainment tracking against quarterly targets.
- **High-Priority Follow-ups**: AI alerts for high-score inbound leads and overdue tasks.

### 2. 🗂️ Interactive Sales Pipeline & Kanban Board
- **Fluid Drag-and-Drop / Interactive Progression**: Move deals between `Discovery`, `Qualification`, `Demo Scheduled`, `Proposal Sent`, `Negotiation`, `Closed Won`, and `Closed Lost`.
- **View Toggle**: Switch effortlessly between visual Kanban columns and sortable table views.
- **Deal Intelligence**: AI win probability estimation, deal health risk scores, and tactical win recommendations.

### 3. 🎯 Leads & 1-Click Conversion Engine
- **Predictive AI Scoring**: Algorithmic scoring (0–100) evaluating budget readiness, decision-maker seniority, and acquisition channel.
- **1-Click Conversion**: Automatically convert qualified leads into Account (Company), Contact, and Pipeline Deal records with linked associations.

### 4. 🏢 360° Company & Account Profiles
- Comprehensive account overviews displaying annual revenue, employee tiers, linked contacts, active deal pipeline values, and historic engagement notes.

### 5. 👥 Contacts & Decision Maker Directory
- Direct contact profiles with one-click email composition, communication history, linked deals, and custom notes.

### 6. ✅ Tasks, Follow-ups & Reminders
- Prioritized task management (`Urgent`, `High`, `Medium`, `Low`) linked to specific deals, accounts, or contacts, with instant status toggling.

### 7. ✉️ Email Hub & Communications Architecture
- Outbound enterprise email composer with reusable smart templates, dynamic token substitution (`{{contact_name}}`, `{{company_name}}`, `{{sender_name}}`), and complete dispatch audit logs.

### 8. 📈 Revenue Forecasting & Scenario Modeling
- Quarterly trajectory modeling with Commit (high confidence), Pipeline Weighted, and Best Case (upside) revenue breakdowns.

### 9. 🛡️ Role-Based Access Control (RBAC) & Team Management
- Granular permissions matrix supporting `Admin`, `Sales Manager`, `Sales Rep`, `Marketing`, and `Analyst` roles with instant profile switching for testing.

### 10. 📜 SOC2-Ready Compliance Audit Logs
- Immutable audit trail recording state transitions, creations, updates, conversions, and deletions with actor attribution and JSON payload snapshots.

### 11. 🤖 Gemini AI Sales Copilot
- Server-side Gemini integration offering:
  - **Lead Scoring & Enrichment**
  - **Deal Risk & Win Strategy Generation**
  - **Cold Outreach & Follow-up Email Drafting**
  - **Unstructured Meeting Note Extraction & Action Item Mining**

### 12. 🧪 In-App Automated Test Runner
- Live test suite validating CRUD operations, business logic, RBAC security assertions, and API health with real-time pass/fail reporting.

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    React 19 Frontend                    │
│      Tailwind CSS • Recharts • Lucide Icons • Motion     │
│   (AuthContext, CRMContext, ThemeContext, Modals, Views) │
└────────────────────────────┬────────────────────────────┘
                             │ REST API (/api/*)
┌────────────────────────────▼────────────────────────────┐
│                  Express Backend Server                 │
│         Middleware • RBAC Guard • Schema Validation     │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
┌──────────────▼─────────────┐ ┌───────────▼──────────────┐
│  CRM JSON Database Store   │ │  Google Gemini 2.5 Flash │
│  (Persistent Entity Store) │ │    (AI Copilot Engine)   │
└────────────────────────────┘ └──────────────────────────┘
```

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Recharts, Lucide React, Motion.
- **Backend**: Node.js, Express 4, TypeScript (`tsx` runtime).
- **AI Intelligence**: `@google/genai` (Gemini 2.5 Flash) executing server-side for secure prompt execution.
- **Persistence**: File-backed JSON store with transaction safety, automatic seed bootstrap, and atomic writes.

---

## 💾 Database Schema Description

The system implements normalized relational entities:
- `User`: Team member with `id`, `email`, `name`, `role`, `quota`, `avatar`.
- `Company`: Account profile with `id`, `name`, `domain`, `industry`, `size`, `annualRevenue`, `status`.
- `Contact`: Contact person with `id`, `firstName`, `lastName`, `email`, `phone`, `title`, `companyId`.
- `Lead`: Prospective lead with `id`, `title`, `company`, `contactName`, `email`, `score`, `scoreRationale`, `status`, `source`, `estimatedValue`.
- `Deal`: Sales opportunity with `id`, `title`, `value`, `stage`, `probability`, `expectedCloseDate`, `priority`, `companyId`, `contactId`, `assignedToId`, `aiRiskScore`, `aiWinRecommendation`.
- `Task`: Action item with `id`, `title`, `status`, `priority`, `dueDate`, `assignedToId`, `relatedType`, `relatedId`.
- `Activity`: Interaction log with `id`, `type`, `title`, `description`, `relatedType`, `relatedId`, `createdById`.
- `EmailLog`: Dispatched communications with `id`, `to`, `subject`, `body`, `status`, `senderId`, `sentAt`.
- `AuditLog`: Security audit trail with `id`, `action`, `entityType`, `entityId`, `userId`, `userName`, `timestamp`, `details`, `changes`.

---

## 🛠️ Installation & Local Setup

### Prerequisites
- Node.js 18+ and npm installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Ensure your `GEMINI_API_KEY` is provided:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check & timestamp |
| `GET` | `/api/dashboard/metrics` | Aggregate pipeline, stage stats & rep leaderboard |
| `GET` | `/api/dashboard/forecast` | Quarterly weighted revenue projections |
| `GET` | `/api/deals` | List all deals (with query filters) |
| `POST` | `/api/deals` | Create a new sales deal |
| `GET` | `/api/deals/:id` | Fetch deal detail, linked activities & tasks |
| `PATCH` | `/api/deals/:id/stage` | Advance deal stage milestone |
| `DELETE` | `/api/deals/:id` | Delete deal (requires Admin/Manager role) |
| `GET` | `/api/leads` | List all inbound leads |
| `POST` | `/api/leads` | Create a new lead |
| `POST` | `/api/leads/:id/convert` | 1-Click convert lead to Account & Deal |
| `GET` | `/api/companies` | List all company accounts |
| `POST` | `/api/companies` | Create a company account |
| `GET` | `/api/companies/:id` | Fetch company 360° profile |
| `GET` | `/api/contacts` | List contacts directory |
| `POST` | `/api/contacts` | Create a new contact |
| `GET` | `/api/tasks` | List action items |
| `POST` | `/api/tasks` | Create task / reminder |
| `PATCH` | `/api/tasks/:id/status` | Toggle task completion status |
| `POST` | `/api/emails/send` | Dispatch outbound email & log audit record |
| `GET` | `/api/emails/logs` | Fetch email dispatch history |
| `GET` | `/api/audit-logs` | Retrieve immutable compliance audit trail |
| `POST` | `/api/ai/score-lead` | Run AI lead scoring model |
| `POST` | `/api/ai/deal-copilot` | Run AI deal risk & win plan generator |
| `POST` | `/api/ai/draft-email` | AI sales outreach email generator |
| `POST` | `/api/ai/extract-notes` | AI unstructured note analysis & task extractor |
| `POST` | `/api/tests/run` | Execute automated test suite |

---

## 🧪 Automated Testing

NexusCRM includes an integrated test runner testing:
- **API Health Check**: Verifies backend server response.
- **Dashboard Metrics Engine**: Confirms accuracy of win rate and pipeline calculations.
- **Lead-to-Account Conversion**: Tests relational entity creation and integrity.
- **Deal Stage Transition**: Validates pipeline state transitions and win probabilities.
- **Task Workflow**: Tests task lifecycle and status toggling.
- **Audit Logging**: Ensures compliance records are appended upon state modifications.
- **RBAC Security Boundaries**: Asserts unauthorized delete prevention for non-admin roles.

Run the test suite directly from the UI by clicking **"Run Tests"** in the top navigation bar.

---

## 📄 License
MIT License. Open source and ready for enterprise customization.
