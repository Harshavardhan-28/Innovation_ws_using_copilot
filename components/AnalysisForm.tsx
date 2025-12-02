'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalysisForm() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeInputType, setResumeInputType] = useState<'file' | 'text'>('file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
        setResumeFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setResumeFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setError('');
      setResumeFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter the job description/requirements');
      return;
    }
    
    // Check resume input based on selected type
    if (resumeInputType === 'file' && !resumeFile) {
      setError('Please upload your resume');
      return;
    }
    if (resumeInputType === 'text' && !resumeText.trim()) {
      setError('Please enter your resume text');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to analyze');
      return;
    }

    setLoading(true);

    try {
      let requestBody: {
        userId: string;
        jobTitle: string;
        company: string;
        jobDescription: string;
        resumeText?: string;
        resumeBase64?: string;
        resumeFileType?: string;
      } = {
        userId: user.uid,
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        jobDescription: jobDescription.trim(),
      };

      if (resumeInputType === 'file' && resumeFile) {
        const base64 = await fileToBase64(resumeFile);
        requestBody.resumeBase64 = base64;
        requestBody.resumeFileType = resumeFile.type;
      } else {
        requestBody.resumeText = resumeText.trim();
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      // Redirect to the analysis result page
      router.push(`/analysis/${data.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Details */}
      <div className="glass-strong rounded-xl p-6 border border-dark-600/50">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center mr-3 text-dark-900 text-sm font-bold">1</span>
          Job Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-300 mb-2">
              Job Title <span className="text-accent-cyan">*</span>
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all duration-200"
              placeholder="e.g., Senior Software Engineer"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
              Company <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all duration-200"
              placeholder="e.g., Google"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-300 mb-2">
            Job Description / Requirements <span className="text-accent-cyan">*</span>
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all duration-200 resize-none"
            placeholder="Paste the full job description here, including requirements, responsibilities, and qualifications..."
            disabled={loading}
          />
        </div>
      </div>

      {/* Resume Section */}
      <div className="glass-strong rounded-xl p-6 border border-dark-600/50">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center mr-3 text-white text-sm font-bold">2</span>
          Your Resume
        </h2>
        
        {/* Input Type Toggle */}
        <div className="flex mb-4 border-b border-dark-600">
          <button
            type="button"
            onClick={() => {
              setResumeInputType('file');
              setError('');
            }}
            className={`flex-1 pb-3 text-center font-medium transition-all duration-200 relative ${
              resumeInputType === 'file'
                ? 'text-accent-cyan'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload File
            </span>
            {resumeInputType === 'file' && (
              <motion.div
                layoutId="resumeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setResumeInputType('text');
              setError('');
            }}
            className={`flex-1 pb-3 text-center font-medium transition-all duration-200 relative ${
              resumeInputType === 'text'
                ? 'text-accent-cyan'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Paste Text
            </span>
            {resumeInputType === 'text' && (
              <motion.div
                layoutId="resumeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {resumeInputType === 'file' ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Resume File <span className="text-accent-cyan">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Upload your resume as PDF or Word document (max 10MB)
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  resumeFile 
                    ? 'border-accent-cyan/50 bg-accent-cyan/5' 
                    : 'border-dark-600 hover:border-dark-500 bg-dark-700/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-file"
                  disabled={loading}
                />
                
                {resumeFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{resumeFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                      disabled={loading}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <label htmlFor="resume-file" className="cursor-pointer">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-accent-cyan">Click to upload</p>
                        <p className="text-xs text-slate-500">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-600">PDF, DOC, or DOCX</p>
                    </div>
                  </label>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <label htmlFor="resumeText" className="block text-sm font-medium text-slate-300 mb-2">
                Resume Text <span className="text-accent-cyan">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Paste your resume content here. For best results, include all relevant experience, skills, and education.
              </p>
              <textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all duration-200 resize-none font-mono text-sm"
                placeholder="Paste your resume text here...

Example format:

JOHN DOE
john.doe@email.com | (555) 123-4567

SUMMARY
Experienced software engineer with 5+ years...

EXPERIENCE
Senior Software Engineer | ABC Company | 2020 - Present
- Led development of...

SKILLS
JavaScript, TypeScript, React, Node.js..."
                disabled={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 0 30px rgba(34, 211, 238, 0.4)' }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="px-8 py-3 bg-gradient-to-r from-accent-cyan to-primary-400 text-dark-900 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-glow"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing with AI...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analyze Resume
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
