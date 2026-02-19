# Health Plus - Healthcare Appointment System

A comprehensive healthcare appointment booking system built with React frontend and Node.js/Express backend with MongoDB database.

## 🚀 Project Overview

Health Plus is a modern web application that allows patients to:
- Browse healthcare services and doctors
- Book appointments online
- Receive email confirmations
- User authentication (Login/Signup)
- Manage appointment preferences (voice/video calls)

## 🛠️ Technologies Used

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
│   ├── server.js              # Main backend server
│   ├── authMiddleware.js      # JWT authentication middleware
│   ├── emailService.js        # Email sending service
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Example environment file
│   └── package.json           # Backend dependencies
├── src/
│   ├── Components/            # React components
│   │   ├── AppointmentForm.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── ...
│   ├── Styles/                # CSS files
│   ├── Pages/                 # Page components
│   └── Assets/                # Images and media
├── public/                    # Static files
└── package.json               # Frontend dependencies
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
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthplus
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
JWT_SECRET=your-secret-key-here
```

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

Backend will run on: **http://localhost:5000**

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

### Start Frontend Application

Open a **new terminal** and run:

```bash
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
Appointment saved to MongoDB (status: 'pending') →
If email provided: Nodemailer sends confirmation email →
Success response to frontend →
Toast notification shown →
Form reset
```

#### 3. Email Notification Flow

```
Appointment created with email →
emailService.js triggered →
Connects to Gmail via SMTP →
Generates HTML email with appointment details →
Sends email to patient →
Email includes: patient name, date/time, mode, appointment ID →
Confirmation logged in backend
```

#### 4. Data Retrieval

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
GET http://localhost:5000/api/health
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
Response: { success, data, emailSent }
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

When a patient provides an email during appointment booking:

✅ **Automatic confirmation email sent**
✅ **Professional HTML template**
✅ **Includes:**
- Patient name
- Appointment date & time (formatted)
- Preferred consultation mode
- Contact information

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
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F

# Restart backend
cd backend
node server.js
```

### MongoDB connection error
- Ensure MongoDB service is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is installed correctly

### Email not sending
- Verify Gmail app password (16 characters)
- Check 2FA is enabled on Gmail
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env`
- Check Gmail "Less secure app access" settings

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API URLs in React components

## 📝 Development Notes

- Backend automatically creates database and collections
- First appointment booking creates the `appointments` collection
- First user registration creates the `users` collection
- All timestamps are stored in UTC
- Passwords are never stored in plain text

## 👥 Contributors

- **Kishore Kiran** - Full Stack Developer

## 📱 Social Links

- Facebook: https://share.google/zHToEPwiN8yDCXRQLA
- LinkedIn: https://www.linkedin.com/in/kiran-kishore

## 📄 License

© 2026 Health+. All rights reserved.

## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB for database solutions
- Nodemailer for email service integration
