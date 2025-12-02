# ResumeAI - AI-Powered Resume Analysis

A Next.js 14 application that uses Google Gemini AI to analyze resumes against job requirements, providing match scores, feedback, and tailored interview questions.

## Features

- 🔐 **User Authentication** - Email/password authentication with Firebase
- 📄 **Resume Analysis** - AI-powered analysis using Google Gemini
- 📊 **Match Score** - Get a 0-100 score showing resume-job fit
- 💬 **Feedback Summary** - Concise feedback on strengths and areas for improvement
- ❓ **Interview Questions** - Tailored questions based on job requirements
- ✍️ **Application Help** - Questions to help craft cover letters and essays
- 📁 **Analysis History** - View all past analyses on your dashboard

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **AI**: Google Gemini API

## Prerequisites

Before running this application, you'll need:

1. **Node.js 18+** installed on your machine
2. **Firebase Project** - Create one at [Firebase Console](https://console.firebase.google.com/)
3. **Google Gemini API Key** - Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Setup Instructions

### 1. Clone and Install

```bash
cd resume-analyzer-mvp
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** with Email/Password provider:
   - Go to Authentication → Sign-in method → Enable Email/Password
3. Enable **Realtime Database**:
   - Go to Realtime Database → Create Database
   - Start in test mode (for development)
   - Copy the database URL (e.g., `https://your-project-default-rtdb.firebaseio.com`)
4. Get your Firebase config:
   - Go to Project Settings → General → Your apps → Add app (Web)
   - Copy the config values

### 3. Firebase Realtime Database Rules

Go to Realtime Database → Rules and set up these security rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "analyses": {
      ".indexOn": ["userId"],
      "$analysisId": {
        ".read": "auth != null && data.child('userId').val() === auth.uid",
        ".write": "auth != null && (newData.child('userId').val() === auth.uid || data.child('userId').val() === auth.uid)"
      }
    }
  }
}
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add it to your `.env.local` file

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # API route for resume analysis
│   ├── analysis/
│   │   ├── new/
│   │   │   └── page.tsx        # New analysis form
│   │   └── [id]/
│   │       └── page.tsx        # Analysis results page
│   ├── auth/
│   │   └── page.tsx            # Login/Signup page
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── AnalysisCard.tsx        # Analysis preview card
│   ├── AnalysisForm.tsx        # Resume analysis form
│   ├── AuthForm.tsx            # Login/Signup form
│   ├── AuthProvider.tsx        # Auth context provider
│   ├── Navbar.tsx              # Navigation bar
│   └── ProtectedRoute.tsx      # Route protection wrapper
├── lib/
│   ├── firebase.ts             # Firebase initialization
│   ├── firestore.ts            # Database helpers
│   └── gemini.ts               # Gemini API integration
├── types/
│   └── index.ts                # TypeScript interfaces
└── ...config files
```

## Usage

1. **Sign Up/Login**: Create an account or log in with your email and password
2. **Create Analysis**: Click "New Analysis" and enter:
   - Job title and company (optional)
   - Full job description/requirements
   - Your resume text
3. **View Results**: Get your match score, feedback, and tailored questions
4. **Dashboard**: View all your past analyses

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Deployment

This app can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Firebase Hosting**
- **Any Node.js hosting platform**

Make sure to set all environment variables in your deployment platform.

## Security Notes

- The Firebase Realtime Database rules should be configured to only allow authenticated users to read/write their own data
- Never expose your API keys in client-side code
- The Gemini API key is only used server-side

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
