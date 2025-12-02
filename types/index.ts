// User type stored in Realtime Database
export interface User {
  uid: string;
  email: string;
  createdAt: number; // timestamp
}

// Input for creating a new analysis
export interface AnalysisInput {
  userId: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
  resumeText: string;
}

// The result from Gemini analysis
export interface GeminiAnalysisResult {
  score: number; // 0-100
  feedbackSummary: string;
  interviewQuestions: string[];
  applicationQuestions: string[];
}

// Full analysis document stored in Realtime Database
export interface AnalysisDocument {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
  score: number;
  feedbackSummary: string;
  interviewQuestions: string[];
  applicationQuestions: string[];
  createdAt: number; // timestamp
}

// Auth context type
export interface AuthContextType {
  user: import('firebase/auth').User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
