import { database } from './firebase';
import { 
  ref, 
  push, 
  get, 
  set, 
  query, 
  orderByChild, 
  equalTo 
} from 'firebase/database';
import { 
  AnalysisDocument, 
  AnalysisInput, 
  GeminiAnalysisResult, 
  User 
} from '@/types';

/**
 * Create or update a user record in the Realtime Database
 */
export async function saveUser(uid: string, email: string): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);
  
  if (!snapshot.exists()) {
    const user: User = {
      uid,
      email,
      createdAt: Date.now(),
    };
    await set(userRef, user);
  }
}

/**
 * Save a new analysis to the Realtime Database
 */
export async function saveAnalysis(
  input: AnalysisInput,
  result: GeminiAnalysisResult
): Promise<AnalysisDocument> {
  const analysesRef = ref(database, 'analyses');
  const newAnalysisRef = push(analysesRef);
  
  const analysis: AnalysisDocument = {
    id: newAnalysisRef.key!,
    userId: input.userId,
    jobTitle: input.jobTitle,
    company: input.company || '',
    jobDescription: input.jobDescription,
    resumeText: input.resumeText,
    score: result.score,
    feedbackSummary: result.feedbackSummary,
    interviewQuestions: result.interviewQuestions,
    applicationQuestions: result.applicationQuestions,
    createdAt: Date.now(),
  };
  
  await set(newAnalysisRef, analysis);
  
  return analysis;
}

/**
 * Get all analyses for a specific user
 */
export async function getUserAnalyses(userId: string): Promise<AnalysisDocument[]> {
  const analysesRef = ref(database, 'analyses');
  const userAnalysesQuery = query(
    analysesRef,
    orderByChild('userId'),
    equalTo(userId)
  );
  
  const snapshot = await get(userAnalysesQuery);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const analyses: AnalysisDocument[] = [];
  snapshot.forEach((childSnapshot) => {
    analyses.push(childSnapshot.val() as AnalysisDocument);
  });
  
  // Sort by createdAt descending (most recent first)
  analyses.sort((a, b) => b.createdAt - a.createdAt);
  
  return analyses;
}

/**
 * Get a single analysis by ID
 */
export async function getAnalysisById(id: string): Promise<AnalysisDocument | null> {
  const analysisRef = ref(database, `analyses/${id}`);
  const snapshot = await get(analysisRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return snapshot.val() as AnalysisDocument;
}
