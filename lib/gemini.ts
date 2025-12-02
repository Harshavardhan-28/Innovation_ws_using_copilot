import { GoogleGenAI, Type } from '@google/genai';
import { GeminiAnalysisResult } from '@/types';

// Initialize the Google GenAI client
// The API key is automatically picked up from GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Analyze a resume against job requirements using Gemini
 * Supports both text-based resumes and document files (PDF/Word)
 */
export async function analyzeResume(
  resumeData: string,
  jobDescription: string,
  fileType?: string // 'application/pdf' or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
): Promise<GeminiAnalysisResult> {
  const prompt = `
You are an expert career coach and resume analyst. Your task is to analyze a candidate's resume against a specific job description and provide detailed, actionable feedback.

## Job Description / Requirements:
${jobDescription}

## Your Analysis Task:
Please analyze how well this resume matches the job requirements. Provide your response in the exact JSON format specified below.

Consider the following when scoring:
- Relevant skills match (technical and soft skills)
- Experience level alignment
- Industry/domain knowledge
- Education and certifications relevance
- Keywords and terminology match
- Overall presentation and clarity

Scoring Guidelines:
- 90-100: Excellent match - candidate exceeds most requirements
- 75-89: Strong match - candidate meets most key requirements
- 60-74: Moderate match - candidate meets some requirements but has gaps
- 40-59: Weak match - significant gaps but some transferable skills
- 0-39: Poor match - candidate lacks most required qualifications

For interview questions, focus on:
1. Technical competencies mentioned in the job description
2. Gaps or areas needing clarification from the resume
3. Behavioral questions relevant to the role
4. Situational questions based on the job requirements

For application questions, provide questions that would help the candidate:
1. Explain why they're a good fit for this specific role
2. Address any gaps between their experience and requirements
3. Highlight relevant achievements and experiences
4. Craft compelling cover letter content

Please respond with ONLY valid JSON matching the schema below.
`;

  try {
    // Build the contents array based on whether we have a file or text
    let contents: Array<{ inlineData?: { data: string; mimeType: string }; text?: string }> | string;

    if (fileType && resumeData) {
      // Document file provided - use multimodal input
      contents = [
        {
          inlineData: {
            data: resumeData, // base64 encoded document
            mimeType: fileType,
          },
        },
        {
          text: prompt,
        },
      ];
    } else {
      // Plain text resume
      contents = `${prompt}\n\n## Candidate's Resume:\n${resumeData}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'Match score from 0 to 100',
            },
            feedbackSummary: {
              type: Type.STRING,
              description: 'A concise 2-4 sentence summary of how well the resume matches the job requirements, highlighting key strengths and areas for improvement',
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'Array of 5-7 tailored interview questions based on the job requirements and resume analysis',
            },
            applicationQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'Array of 4-6 questions to help the candidate write better application materials (cover letters, essays, "why this role" answers)',
            },
          },
          propertyOrdering: ['score', 'feedbackSummary', 'interviewQuestions', 'applicationQuestions'],
        },
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster responses
        },
      },
    });

    const jsonStr = response.text?.trim();
    
    if (!jsonStr) {
      throw new Error('Empty response from Gemini');
    }

    const result: GeminiAnalysisResult = JSON.parse(jsonStr);

    // Validate the response structure
    if (
      typeof result.score !== 'number' ||
      typeof result.feedbackSummary !== 'string' ||
      !Array.isArray(result.interviewQuestions) ||
      !Array.isArray(result.applicationQuestions)
    ) {
      throw new Error('Invalid response structure from Gemini');
    }

    // Ensure score is within bounds
    result.score = Math.max(0, Math.min(100, Math.round(result.score)));

    return result;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Return a fallback response if the API fails
    // In production, you might want to throw the error instead
    throw new Error(
      `Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
