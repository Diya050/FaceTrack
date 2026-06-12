# FaceTrack – Video Stream Attendance Management System

AI-powered attendance management system using real-time facial recognition and video stream processing.

## Overview

FaceTrack is a smart attendance management platform that automates attendance tracking through real-time facial recognition. The system identifies registered individuals from live video streams and records attendance automatically while providing analytics, notifications, correction workflows, and secure role-based administration.

The platform supports multiple organizational roles including Super Admin, Organization Admin, HR Admin, Department Admin, and Users.


## Tech Stack

### Frontend

* React
* TypeScript

### Backend

* Python
* FastAPI

### AI / ML

* OpenCV
* ArcFace
* RetinaFace

### Video Processing

* OpenCV

### Database

* PostgreSQL

### Authentication & Security

* JWT Authentication
* Role-Based Access Control (RBAC)


# Features

* Real-time facial recognition attendance
* Live video stream processing
* Face enrollment and validation
* Role-based user access
* Attendance analytics & reports
* Attendance correction workflow
* Unknown face detection
* Notification system
* Multi-organization support
* Secure image processing


# System Architecture

Video Stream
↓
RetinaFace → Face Detection
↓
ArcFace → Face Embedding Generation
↓
Face Matching Engine
↓
Attendance Service
↓
PostgreSQL Database
↓
Dashboard & Analytics


# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/Diya050/FaceTrack.git

cd FaceTrack
```


## 2. Backend Setup (FastAPI)

Navigate to backend:

```bash
cd backend
```

Create virtual environment:

### Windows

```bash
python -m venv .venv
```

Activate:

```bash
.venv\Scripts\activate
```

### Linux / Mac

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```


## 3. Configure Environment Variables

Create `.env`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/facetrack
SECRET_KEY=your_secret_key

SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# -- Attendance job -----------------------------------------------------------
ATTENDANCE_DEFAULT_OFFSET_DAYS:int=1        # process yesterday by default
ATTENDANCE_CATCHUP_DAYS:int=7               # look back 7 days on startup
 
# -- Scheduler ---------------------------------------------------------------
SCHEDULER_TIMEZONE="Asia/Kolkata"
SCHEDULER_DAILY_HOUR=0                  # midnight IST
SCHEDULER_DAILY_MINUTE=30              # 00:30 IST
SCHEDULER_MISFIRE_GRACE_SECONDS=3600    # 1 hour grace window
SCHEDULER_JOB_ID="daily_attendance_job"
 
# -- Startup behaviour --------------------------------------------------------
ENABLE_CATCHUP_ON_STARTUP =True
RUN_JOB_ON_STARTUP=True
STARTUP_DAILY_JOB_DELAY_SECONDS=5      # delay daily job so catchup starts first


SMTP_EMAIL=
SMTP_PASSWORD=
SMTP_SERVER=
SMTP_PORT=

```


## 4. Database Setup (PostgreSQL)

Create database:

```sql
CREATE DATABASE facetrack;
```

Run migrations:

```bash
alembic upgrade head
```


## 5. Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend:

```bash
http://localhost:8000
```

Swagger Docs:

```bash
http://localhost:8000/docs
```


## 6. Frontend Setup (React + TypeScript)

Open another terminal:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```


## 7. Run Face Recognition Module

Start video processing:

```bash
cd backend/app
python camera_client.py
```

Pipeline:

```text
Camera
↓
Frame Capture
↓
RetinaFace Detection
↓
ArcFace Recognition
↓
Attendance Marked
```


# Authentication Flow

```
Login
↓
JWT Generation
↓
Role Verification (RBAC)
↓
Protected API Access
```
Roles:

* Super Admin
* Organization Admin
* HR Admin
* Department Admin
* User

