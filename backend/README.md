# Health Plus Backend API

## Setup Instructions

### 1. Install MongoDB

**Option A: Install MongoDB locally**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: Use MongoDB Atlas (Cloud - Recommended)**
- Go to: https://www.mongodb.com/cloud/atlas
- Create free account
- Create a cluster
- Get connection string and update in `.env` file

### 2. Install Dependencies

```powershell
cd backend
npm install
```

### 3. Configure Environment

Create `.env` file from `.env.example`:
```powershell
copy .env.example .env
```

Edit `.env` file with your credentials:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthplus
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Go to: https://myaccount.google.com/apppasswords
3. Generate App Password
4. Use the 16-character password in `.env`

### 5. Start Backend Server

```powershell
cd backend
npm start
```

For development with auto-reload:
```powershell
npm run dev
```

Server will run on: http://localhost:5000

### 6. Test API

Health check endpoint:
```
GET http://localhost:5000/api/health
```

## API Endpoints

### Appointments

- **GET** `/api/appointments` - Get all appointments
- **GET** `/api/appointments/:id` - Get single appointment
- **POST** `/api/appointments` - Create new appointment
- **PATCH** `/api/appointments/:id` - Update appointment status
- **DELETE** `/api/appointments/:id` - Delete appointment

### Example Request

```javascript
POST http://localhost:5000/api/appointments
Content-Type: application/json

{
  "patientName": "John Doe Smith",
  "patientNumber": "1234567890",
  "patientEmail": "patient@example.com",
  "patientGender": "male",
  "appointmentTime": "2026-02-10T14:30",
  "preferredMode": "video"
}
```

## Running Full Application

### Terminal 1 - Backend
```powershell
cd backend
npm start
```

### Terminal 2 - Frontend
```powershell
cd ..
npm start
```

Frontend: http://localhost:3000/Health-Plus  
Backend: http://localhost:5000

## Email Feature

- When a patient provides an email, a confirmation email is automatically sent
- Email includes appointment details and formatted date/time
- Professional HTML email template
- Error handling if email fails (appointment still saved)

## Database Schema

```javascript
{
  patientName: String (min 8 chars),
  patientNumber: String (10 digits),
  patientEmail: String (optional),
  patientGender: String (male/female/private),
  appointmentTime: Date,
  preferredMode: String (voice/video),
  status: String (pending/confirmed/cancelled/completed),
  createdAt: Date
}
```

## Notes

- Backend must be running before submitting appointments from frontend
- MongoDB must be running/connected
- CORS is enabled for localhost:3000
- All appointments are stored in MongoDB database
- Email feature requires valid Gmail app password
