# Hospital Management System (MERN)

Built to match this flow:
Start -> Hospital Staff Login -> Add Room / Add Doctor / Add Patient
-> Assign Room / Assign Doctor -> Generate Bill (Room Bill / Doctor Bill / Medicine Bill)
-> Pay Bill (No -> loop back / Yes -> continue) -> Discharge Patient -> Reports -> Stop

## Tech
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT + bcrypt
- Frontend: React + Vite + React Router + Axios

## Setup

### 1. Backend
```
cd backend
npm install
cp .env.example .env
# edit .env -> add your MONGO_URI and JWT_SECRET
npm run dev
```
Server runs on http://localhost:5000

First time only — create a staff login (Postman or curl):
```
POST http://localhost:5000/api/auth/register
{
  "name": "Admin Staff",
  "email": "staff@hospital.com",
  "password": "123456"
}
```

### 2. Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs on http://localhost:5173 — login with the staff account you just registered.

## Flow -> Code mapping
| Flowchart step     | Where it lives                                      |
|---------------------|-----------------------------------------------------|
| Login               | POST /api/auth/login, frontend `pages/Login.jsx`    |
| ADD Room            | POST /api/rooms, `pages/Rooms.jsx`                  |
| ADD Doctor          | POST /api/doctors, `pages/Doctors.jsx`              |
| ADD Patient         | POST /api/patients, `pages/Patients.jsx`            |
| Assign Room         | PUT /api/patients/:id/assign-room                   |
| Assign Doctor       | PUT /api/patients/:id/assign-doctor                 |
| Generate Bill       | POST /api/bills/generate, `pages/Billing.jsx`       |
| Room/Doctor/Medicine Bill | fields on the Bill model, computed in `billController.js` |
| Pay Bill            | PUT /api/bills/:id/pay                              |
| Discharge Patient   | PUT /api/patients/:id/discharge                     |
| Reports             | GET /api/reports/summary, /api/reports/discharged   |

## Notes for your viva
- Room status auto-flips available <-> occupied when assigned/discharged.
- Room Bill is auto-calculated as (days admitted x room price/day) — not manually entered.
- A patient should normally be discharged only after their bill's `paymentStatus` becomes `paid` — this is enforced in the UI flow (Billing page tells you to go discharge after payment), you can make it a hard backend check if your professor wants stricter enforcement.
