# Health Plus - Healthcare Appointment System 🏥

A comprehensive healthcare appointment booking system built with React frontend and Node.js/Express backend with MongoDB database.

## 🚀 Project Overview

Health Plus is a modern web application that allows patients to:
- 🔍 Browse healthcare services and doctors
- 📅 Book appointments online (voice/video consultations)
- 💬 **Live Chat Bot** with intelligent AI responses
- 📧 Receive automated email confirmations
- 👤 User authentication (Login/Signup)
- 🔔 **Admin notifications** for new appointments
- 📱 Fully responsive mobile-friendly design

## � Table of Contents

- [Technologies Used](#️-technologies-used)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Installation & Setup](#️-installation--setup)
- [Running the Project](#-running-the-project)
- [Data Storage](#️-data-storage)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Email Features](#-email-features)
- [Live Chat Bot Features](#-live-chat-bot-features)
- [Security Features](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [Contact](#-contact--social-links)

## �🛠️ Technologies Used

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **React Toastify** - Notifications
- **CSS3** - Styling
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Nodemailer** - Email service
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this project, ensure you have:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Gmail account** (for email notifications)

## 📂 Project Structure

```
Health-Plus-main/
├── backend/
│   ├── routes/
│   │   └── chat.js            # Live chat API routes
│   ├── server.js              # Main backend server
│   ├── authMiddleware.js      # JWT authentication middleware
│   ├── emailService.js        # Email sending service
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Example environment file
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── Components/        # React components
│   │   │   ├── AppointmentForm.js
│   │   │   ├── LiveChat.js    # Live chat component
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── ...
│   │   ├── Styles/            # CSS files
│   │   │   ├── LiveChat.css   # Chat component styles
│   │   │   └── ...
│   │   ├── Pages/             # Page components
│   │   └── Assets/            # Images and media
│   ├── public/                # Static files
│   └── package.json           # Frontend dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## ⚡ Quick Start Guide

For experienced developers who want to get started immediately:

```bash
# 1. Clone repository
git clone https://github.com/kishore0000123/Health-Plus-main.git
cd Health-Plus-main

# 2. Install backend dependencies
cd backend
npm install

# 3. Create .env file (copy from .env.example)
copy .env.example .env  # Windows
# cp .env.example .env  # Mac/Linux

# 4. Edit .env with your Gmail credentials and MongoDB URI

# 5. Start backend (in backend directory)
npm start

# 6. Open new terminal - Install frontend dependencies
cd ../frontend
npm install

# 7. Start frontend
npm start

# ✅ App opens at http://localhost:3000
# ✅ Backend runs at http://localhost:5001
```

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/kishore0000123/Health-Plus-main.git
cd Health-Plus-main
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
1. Download and install MongoDB from: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Database will be created automatically at: `mongodb://localhost:27017/healthplus`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create free account at: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update in `.env` file

### 4. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd backend
copy .env.example .env    # On Windows
# or
cp .env.example .env      # On Mac/Linux
```

Edit `backend/.env` with your credentials:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/healthplus
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=your-admin-email@gmail.com
JWT_SECRET=your-secret-key-here
```

⚠️ **Important:** Never commit the `.env` file to GitHub. It's already in `.gitignore`.

### 5. Gmail App Password Setup

For email notifications to work:

1. Enable **2-Factor Authentication** on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate **App Password** for "Health Plus"
4. Copy the 16-character password
5. Paste it in `EMAIL_PASSWORD` in `.env` file

## 🚀 Running the Project

### Start Backend Server

```bash
cd backend
node server.js
```

Backend will run on: **http://localhost:5001**

You should see:
```
🚀 Server running on port 5001
✅ MongoDB Connected Successfully
✅ Email server is ready to send messages
```

### Start Frontend Application

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

Frontend will run on: **http://localhost:3000**

The browser will automatically open the application.

## 🗄️ Data Storage

### Database: MongoDB

**Database Name:** `healthplus`

**Collections:**

#### 1. Appointments Collection
Stores all patient appointment data:

```javascript
{
  _id: ObjectId,                    // Auto-generated unique ID
  patientName: String,              // Min 8 characters
  patientNumber: String,            // 10 digits
  patientEmail: String,             // Optional, for confirmations
  patientGender: String,            // 'male', 'female', or 'private'
  appointmentTime: Date,            // Future date/time
  preferredMode: String,            // 'voice' or 'video'
  status: String,                   // 'pending', 'confirmed', 'cancelled', 'completed'
  createdAt: Date                   // Auto-generated timestamp
}
```

#### 2. Users Collection
Stores registered user accounts:

```javascript
{
  _id: ObjectId,
  name: String,                     // User full name
  email: String,                    // Unique email address
  password: String,                 // Hashed with bcrypt
  phone: String,                    // Optional phone number
  role: String,                     // 'patient', 'doctor', 'admin'
  createdAt: Date
}
```

**Data Location:**
- Local MongoDB: `C:\Program Files\MongoDB\Server\{version}\data\` (Windows)
- MongoDB Atlas: Cloud storage (accessible from anywhere)

## 🔄 How It Works

### Complete Workflow

#### 1. User Registration/Login
```
User visits site → Clicks "Sign up" → Fills registration form → 
Backend validates data → Password hashed → User saved to MongoDB → 
JWT token generated → User logged in
```

#### 2. Appointment Booking Process

```
User clicks "Book Appointment" →
Fills appointment form (name, phone, email, gender, date/time, mode) →
Frontend validates inputs →
Sends POST request to backend API →
Backend validates data →
Appointment saved to MongoDB (status: 'confirmed') →
Email sent to patient (if email provided) →
Email notification sent to admin →
Success response to frontend →
Toast notification shown →
Form reset
```

#### 3. Email Notification Flow

```
Appointment created →
emailService.js triggered →
Connects to Gmail via SMTP →
Generates HTML email with appointment details →
Sends confirmation email to patient (if email provided) →
Sends notification email to admin/doctor →
Emails include: patient name, date/time, mode, contact info →
Confirmations logged in backend
```

#### 4. Live Chat Bot Interaction

```
User clicks "Live Chat" button →
Chat window opens (bottom-right corner) →
User types message →
Frontend sends POST to /api/chat →
Backend processes message with AI logic →
Smart response generated based on keywords →
Response sent back to frontend →
Chat displays bot reply with animation
```

#### 5. Data Retrieval

```
Admin/Doctor requests appointments →
GET /api/appointments called →
Backend queries MongoDB →
Returns sorted appointments (newest first) →
Frontend displays in dashboard
```

## 🔌 API Endpoints

### Health Check
```
GET http://localhost:5001/api/health
Response: { success: true, message: "Server is running" }
```

### Authentication

**Register User**
```
POST /api/auth/register
Body: { name, email, password, phone }
Response: { success, token, user }
```

**Login User**
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

**Get Current User** (Protected)
```
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { success, user }
```

### Live Chat Bot

**Send Chat Message**
```
POST /api/chat
Body: { message: "your message here" }
Response: { 
  success: true, 
  reply: "bot response",
  timestamp: "2026-02-21T10:30:00Z"
}
```

**Supported Queries:**
- Appointment booking
- Doctor information
- Services offered
- Contact details
- Operating hours
- Emergencies
- Pricing information

### Appointments

**Get All Appointments**
```
GET /api/appointments
Response: { success, data: [...appointments] }
```

**Get Single Appointment**
```
GET /api/appointments/:id
Response: { success, data: {...appointment} }
```

**Create Appointment**
```
POST /api/appointments
Body: {
  patientName,
  patientNumber,
  patientEmail (optional),
  patientGender,
  appointmentTime,
  preferredMode
}
Response: { 
  success, 
  data, 
  emailSent: boolean,
  adminNotified: boolean 
}
```

**Update Appointment Status**
```
PATCH /api/appointments/:id
Body: { status: "confirmed" | "cancelled" | "completed" }
Response: { success, data }
```

**Delete Appointment**
```
DELETE /api/appointments/:id
Response: { success, message }
```

## 📧 Email Features

### Patient Confirmation Emails
When a patient provides an email during appointment booking:

✅ **Automatic confirmation email sent**
✅ **Professional HTML template**
✅ **Includes:**
- Patient name
- Appointment date & time (formatted)
- Preferred consultation mode (Voice/Video)
- Contact information
- Status confirmation

### Admin Notification Emails
For every new appointment created:

✅ **Instant notification to admin**
✅ **Detailed patient information**
✅ **Includes:**
- Full patient details (name, email, phone, gender)
- Appointment date & time
- Preferred consultation mode
- Action required alert
- Timestamp of registration

**Email sent via:**
- Gmail SMTP server
- Nodemailer library
- Secure app password authentication

## 🔒 Security Features

- **Password Hashing:** bcryptjs (10 salt rounds)
- **JWT Tokens:** 7-day expiration
- **Environment Variables:** Sensitive data not in code
- **Input Validation:** Both frontend and backend
- **CORS Enabled:** Controlled cross-origin requests
- **.gitignore:** Prevents `.env` from being pushed to GitHub

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is already in use
netstat -ano | findstr :5001

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or change port in backend/.env
PORT=5002

# Restart backend
cd backend
node server.js
```

### MongoDB connection error
- Ensure MongoDB service is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is installed correctly
- For Atlas: Check IP whitelist and credentials

### Email not sending
- Verify Gmail app password (16 characters, no spaces)
- Check 2FA is enabled on Gmail account
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env`
- Ensure `ADMIN_EMAIL` is set in `.env`
- Check Gmail security settings

### Frontend can't connect to backend
- Ensure backend is running on port 5001
- Check browser console (F12) for CORS errors
- Verify API URLs use correct port (5001) in React components
- Clear browser cache and restart

### Live Chat not working
- Verify backend is running
- Check `/api/chat` endpoint is accessible
- Open browser console for error messages
- Ensure port 5001 is used in LiveChat.js
- Try refreshing the page
## 🧪 Testing the Application

### Test Appointment Booking
1. Start both backend and frontend servers
2. Navigate to homepage
3. Click "Book Appointment" button
4. Fill in the form:
   - Patient Name (min 8 characters)
   - Phone Number (10 digits)
   - Email (optional, for confirmations)
   - Select gender
   - Choose date/time (future date)
   - Select voice or video mode
5. Submit and check:
   - Success toast notification appears
   - Email received (if email provided)
   - Admin receives notification email
   - Check MongoDB for saved appointment

### Test Live Chat
1. Click "Live Chat" button in navbar
2. Chat window opens bottom-right
3. Try these test messages:
   - "How do I book an appointment?"
   - "What doctors are available?"
   - "Contact information"
   - "What are your services?"
4. Verify bot responds instantly
5. Check browser console for any errors

### Test Authentication
1. Click "Login" or "Signup"
2. Register new account:
   - Provide name, email, password, phone
   - Verify success message
   - Check you're redirected and logged in
3. Logout and login again
4. Verify JWT token in localStorage

### API Testing with Postman/curl
```bash
# Test Health Check
curl http://localhost:5001/api/health

# Test Chat Endpoint
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"doctor"}'

# Test Appointments
curl http://localhost:5001/api/appointments
```
## � Live Chat Bot Features

### Intelligent Responses
The live chat bot provides smart, context-aware responses for common queries:

- **Appointments:** "How do I book an appointment?"
- **Doctors:** "What specialists are available?"
- **Services:** "What services do you offer?"
- **Contact:** "How can I reach you?"
- **Emergencies:** "I have a medical emergency"
- **Hours:** "When are you available?"
- **Pricing:** "How much does a consultation cost?"

### Chat UI Features
- 🎨 Beautiful animated interface
- 📱 Fully responsive on mobile devices
- ⚡ Real-time message delivery
- 🤖 Typing indicators
- ⏱️ Message timestamps
- 🔘 Quick question buttons
- 🎯 Auto-scroll to latest message
- ❌ Easy close/open functionality

### User Experience
- Click "Live Chat" button in navigation bar
- Chat window appears in bottom-right corner
- Type message or click quick questions
- Instant AI-powered responses
- Helpful guidance for all queries

## 📝 Development Notes

- Backend automatically creates database and collections
- First appointment booking creates the `appointments` collection
- First user registration creates the `users` collection
- All timestamps are stored in UTC
- Passwords are never stored in plain text
- Live chat responses are processed server-side
- Email templates use HTML for professional formatting

## 👥 Contributors

- **Kishore Kiran** - Full Stack Developer

## 📱 Contact & Social Links

- 📧 **Email:** support@healthplus.com | appointment@healthplus.com
- 📞 **Phone:** +022 5454 5252 | +022 2326 6232
- 🔗 **LinkedIn:** [Kiran Kishore](https://www.linkedin.com/in/kiran-kishore)
- 💼 **GitHub:** [kishore0000123](https://github.com/kishore0000123)
- 🌐 **Live Demo:** [Health Plus Main](https://github.com/kishore0000123/Health-Plus-main)

## 📄 License

© 2026 Health+. All rights reserved.

## 🙏 Acknowledgments

- **React community** for excellent documentation and support
- **MongoDB** for robust database solutions
- **Nodemailer** for reliable email service integration
- **Font Awesome** for beautiful icons
- **Express.js** for powerful backend framework

---

## 🌟 Key Features Summary

✅ User Authentication (JWT-based)  
✅ Appointment Booking System  
✅ Live Chat Bot with AI responses  
✅ Email Notifications (Patient + Admin)  
✅ Responsive Mobile Design  
✅ Real-time Data Management  
✅ Secure Password Hashing  
✅ MongoDB Database Integration  
✅ Professional UI/UX Design  
✅ CORS-enabled API  

**Built with ❤️ by Kishore Kiran**
