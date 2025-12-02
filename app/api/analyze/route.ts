import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/gemini';
import { saveAnalysis } from '@/lib/firestore';

interface AnalyzeRequestBody {
  userId: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
  resumeText?: string;
  resumeBase64?: string;
  resumeFileType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequestBody = await request.json();
    
    const { userId, jobTitle, company, jobDescription, resumeText, resumeBase64, resumeFileType } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!jobTitle || !jobTitle.trim()) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Either resumeText or resumeBase64 must be provided
    if (!resumeText?.trim() && !resumeBase64) {
      return NextResponse.json(
        { error: 'Resume is required (either text or file)' },
        { status: 400 }
      );
    }

    // Validate file type if file is provided
    const validFileTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
    ];

    if (resumeBase64 && resumeFileType && !validFileTypes.includes(resumeFileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or Word document.' },
        { status: 400 }
      );
    }

    // Call Gemini API to analyze the resume
    const resumeData = resumeBase64 || resumeText!.trim();
    const analysisResult = await analyzeResume(
      resumeData, 
      jobDescription.trim(),
      resumeBase64 ? resumeFileType : undefined
    );

    // Save the analysis to Firebase Realtime Database
    // Store a placeholder for file-based resumes since we don't want to store large base64 strings
    const savedAnalysis = await saveAnalysis(
      {
        userId,
        jobTitle: jobTitle.trim(),
        company: company?.trim() || '',
        jobDescription: jobDescription.trim(),
        resumeText: resumeBase64 ? '[Resume uploaded as document]' : resumeText!.trim(),
      },
      analysisResult
    );

    return NextResponse.json(savedAnalysis, { status: 200 });
  } catch (error) {
    console.error('Error in analyze API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze resume';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
