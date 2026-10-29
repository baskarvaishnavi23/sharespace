# ShareSpace — Smart Resource Sharing Platform
> **Make Idle Resources Useful. Share Safely. Access Fairly.**  
> *Developed for CodeHack India 2026: “Unlock Underused Equipment and Spaces”*

---

## 1. Problem Statement & Mission

Colleges, university research departments, makerspaces, and community innovation labs house crores worth of specialized equipment (4K cameras, 3D printers, RF oscilloscopes, GPU clusters, CNC mills, robotic arms). Yet, across Indian campuses:
- **65%+ Underutilization:** High-value equipment sits idle outside peak lecture hours.
- **Access Barriers:** Independent student project teams and hackathon competitors lack the budget to acquire specialized tools.
- **Accountability Deficit:** Conventional booking and calendar spreadsheets fail to verify lab safety prerequisites, lack pre-use and return condition inspections, provide no recourse for damage tracking, and allow slot monopolization.

**ShareSpace** provides a production-grade, trusted resource-sharing platform that empowers institutions to catalogue underused assets, enforce prerequisite safety qualifications, prevent double-bookings, conduct inspection handovers, and maintain an immutable cryptographic audit log.

---

## 2. Key Capabilities & Workflow Lifecycle

### Role-Based Permissions & Workspaces
| Role | User Persona | Core Permissions |
| :--- | :--- | :--- |
| **Student / Researcher** | Aarav Sharma | Discover equipment, check prerequisite qualifications, reserve slots, join waiting lists, complete pre-use & return checklists, report issues. |
| **Resource Owner** | Dr. Priya Nair | Publish/edit resources, set availability days/slots, review booking requests with mandatory recorded justification, inspect return checklists. |
| **Facility Manager** | Prof. Rajesh Menon | Adjudicate damage reports, configure campus fair-use caps (max active bookings, weekly hours), monitor utilization analytics. |
| **System Administrator** | Admin Dev | Global platform governance, assign user roles, verify institutional identities, audit the immutable ledger. |

### Complete 5-Stage Booking Lifecycle
```
[ Requested / Pending ] ──(Owner Approves with Reason)──> [ Approved ]
                                                              │
                                                (Pre-Use Inspection Checklist)
                                                              │
                                                              ▼
[ Returned & Closed ] <──(Post-Use Return Checklist)─── [ Checked In ]
         │
(Discrepancy / Damage Flagged)
         │
         ▼
[ Incident Under Review ] ──(Manager Adjudicates via Gemini AI)──> [ Resolved ]
```

---

## 3. Technology Stack & Third-Party Library Disclosure

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React Icons.
- **Backend & Middleware:** Node.js, Express, tsx.
- **Artificial Intelligence:** Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK:
  - **Smart Resource Matcher:** Natural language intent matching to campus tools with suitability explanations.
  - **Dispute Summarizer:** Root-cause estimation and fair corrective action plans for managers.
  - **Alternative Slot Suggester:** Non-conflicting booking recommendations when slots are reserved.
  - *Full rule-based fallback built-in when offline or without API key.*
- **Database & Security:**
  - **Demonstration Mode:** Zero-friction persistent browser engine with pre-seeded multi-role data, audit hash generation, and tab synchronization.
  - **Production Firestore:** Ready schema with accompanying `firestore.rules` enforcing role-based read/write security and append-only audit logs.

---

## 4. Quick Start & Setup Instructions

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Running Locally
```bash
# 1. Clone repository
git clone https://github.com/sharespace/sharespace-platform.git
cd sharespace-platform

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for AI features)
cp .env.example .env
# Set GEMINI_API_KEY="your-gemini-key" if AI matchmaking is desired

# 4. Start full-stack dev server
npm run dev
# The application starts on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## 5. Demonstration Accounts (Instant Evaluation)

ShareSpace includes a built-in top-navigation **Role Switcher** for hackathon judges:

1. **Aarav Sharma (Student / Researcher)**
   - *Institution:* IIT Delhi, Department of Mechanical & Robotics
   - *Status:* Verified Student • Qualifications: Lab Safety Level 1, 3D Printer Operator, Precision Machining.
2. **Neha Gupta (Unverified Student)**
   - *Institution:* External Affiliate College
   - *Status:* Unverified • Use this account to test security barriers when requesting restricted equipment.
3. **Dr. Priya Nair (Resource Owner)**
   - *Institution:* IIT Delhi, Lead of Makerspace & Advanced Manufacturing Cell
   - *Permissions:* Reviews pending booking requests, manages equipment inventory, inspects return reports.
4. **Prof. Rajesh Menon (Facility Manager)**
   - *Institution:* IIT Delhi, Dean of Research & Shared Campus Facilities
   - *Permissions:* Adjudicates incident disputes with Gemini AI, configures campus fair-use caps.
5. **Admin Dev (System Administrator)**
   - *Permissions:* Verifies institutional user credentials and modifies roles.

*Note: Use the "Reset Demo" button in the top banner anytime to refresh the database to baseline.*

---

## 6. End-to-End Evaluation Test Checklist

- [x] **Discovery & Filter:** Filter catalogue by "Fabrication & 3D", "Free Access", or search for "DSLR".
- [x] **Eligibility Validation:** Switch to Neha Gupta (Unverified) and attempt to book the Sony DSLR or 3D Printer; verify that verification errors trigger.
- [x] **Booking Request:** As Aarav Sharma, select a free slot on the Keysight Oscilloscope, input research justification, and submit.
- [x] **Double-Booking Prevention:** Attempt to book the same slot; verify error prompt with option to join the waiting list or trigger AI slot suggestions.
- [x] **Owner Review & Approval:** Switch to Dr. Priya Nair, open the pending request, input approval notes, and approve.
- [x] **Check-In Inspection:** Switch back to Aarav Sharma, click "Perform Check-In Inspection", check off physical & cleanliness items, attach photo, and check in.
- [x] **Return Handover:** Click "Complete Return Inspection", verify accessories, check off restore status, note late return, and finalize check-out.
- [x] **Incident Adjudication:** Switch to Prof. Rajesh Menon, inspect the open projector damage ticket, click "Review & Adjudicate (AI Assist)" to run Gemini root-cause synthesis, record resolution, and mark resolved.
- [x] **Immutable Audit Review:** Navigate to the "Audit Log" tab to inspect the cryptographic SHA-like ledger entries tracking every single event.

---

## 7. Firebase Firestore Integration & Security Rules

To link a live Google Cloud Firebase project:
1. Initialize Firebase SDK in `src/firebase.ts`.
2. Deploy the provided `firestore.rules` file:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. The security rules strictly forbid unauthorized client mutations, prevent self-elevation of roles, enforce owner-only listing controls, and make `/audit_logs` append-only.

---

## 8. Document Outline for Project Report & PDF Export

1. **Executive Summary:** The underutilization paradox on Indian campuses.
2. **Stakeholder Personas:** Students, lab in-charges, deans of facilities, institutional admins.
3. **System Architecture:** Clean React SPA, Express Vite backend, Gemini API proxy, Firestore security models.
4. **Safety & Fair Allocation Framework:** Qualification gating, active booking caps, FCFS + academic waiting list.
5. **Auditability & Dispute Adjudication:** Before/after condition tracking and human-in-the-loop dispute review.
6. **Scalability & Hackathon Roadmap:** RFID smart locks, QR code instant scan check-in, inter-university sharing consortium.

---
*ShareSpace — Empowering the next generation of builders across India.*
