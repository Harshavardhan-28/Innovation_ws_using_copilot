'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAnalysisById } from '@/lib/firestore';
import { AnalysisDocument } from '@/types';
import { motion } from 'framer-motion';

function getScoreColor(score: number): { text: string; gradient: string; glow: string } {
  if (score >= 75) return { 
    text: 'text-emerald-400', 
    gradient: 'from-emerald-500 to-green-400',
    glow: 'shadow-[0_0_40px_rgba(52,211,153,0.4)]'
  };
  if (score >= 50) return { 
    text: 'text-amber-400', 
    gradient: 'from-amber-500 to-yellow-400',
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.4)]'
  };
  return { 
    text: 'text-rose-400', 
    gradient: 'from-rose-500 to-red-400',
    glow: 'shadow-[0_0_40px_rgba(244,63,94,0.4)]'
  };
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Moderate Match';
  return 'Needs Improvement';
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function AnalysisContent() {
  const params = useParams();
  const id = params.id as string;
  
  const [analysis, setAnalysis] = useState<AnalysisDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const data = await getAnalysisById(id);
        if (!data) {
          setError('Analysis not found');
        } else {
          setAnalysis(data);
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError('Failed to load analysis');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-accent-cyan animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-accent-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-slate-400">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 glass-strong rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">{error || 'Analysis not found'}</h2>
          <p className="text-slate-400 mb-6">
            The analysis you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-cyan to-primary-400 text-dark-900 font-medium rounded-lg transition-all duration-200 shadow-glow"
            >
              Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const scoreColors = getScoreColor(analysis.score);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.nav 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/dashboard" className="text-slate-500 hover:text-accent-cyan transition-colors">
              Dashboard
            </Link>
          </li>
          <li className="text-slate-600">/</li>
          <li className="text-white font-medium truncate max-w-[200px]">
            {analysis.jobTitle}
          </li>
        </ol>
      </motion.nav>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div 
          variants={fadeInUp}
          className="glass-strong rounded-xl p-6 mb-6 border border-dark-600/50"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{analysis.jobTitle}</h1>
              {analysis.company && (
                <p className="text-lg text-slate-400 mt-1">{analysis.company}</p>
              )}
              <p className="text-sm text-slate-500 mt-2">
                Analyzed on {formatDate(analysis.createdAt)}
              </p>
            </div>
            
            {/* Score */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center"
            >
              <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${scoreColors.gradient} p-1 ${scoreColors.glow}`}>
                <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreColors.text}`}>{analysis.score}</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm text-slate-500">Match Score</div>
                <div className={`text-sm font-medium ${scoreColors.text}`}>
                  {getScoreLabel(analysis.score)}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.score}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className={`h-full bg-gradient-to-r ${scoreColors.gradient}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Feedback Summary */}
        <motion.div 
          variants={fadeInUp}
          className="glass-strong rounded-xl p-6 mb-6 border border-dark-600/50"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Feedback Summary
          </h2>
          <p className="text-slate-300 leading-relaxed">{analysis.feedbackSummary}</p>
        </motion.div>

        {/* Interview Questions */}
        <motion.div 
          variants={fadeInUp}
          className="glass-strong rounded-xl p-6 mb-6 border border-dark-600/50"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-blue-500 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Tailored Interview Questions
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Prepare for these questions based on the job requirements and your resume.
          </p>
          <ul className="space-y-3">
            {analysis.interviewQuestions.map((question, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start group"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-accent-cyan/20 text-accent-cyan rounded-lg flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-slate-300 flex-1">{question}</span>
                <button
                  onClick={() => copyToClipboard(question, index)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 text-slate-500 hover:text-accent-cyan transition-all"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Application Questions */}
        <motion.div 
          variants={fadeInUp}
          className="glass-strong rounded-xl p-6 mb-6 border border-dark-600/50"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            Application Writing Prompts
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Use these questions to craft compelling cover letters and application essays.
          </p>
          <ul className="space-y-3">
            {analysis.applicationQuestions.map((question, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start group"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-accent-purple/20 text-accent-purple rounded-lg flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-slate-300 flex-1">{question}</span>
                <button
                  onClick={() => copyToClipboard(question, 100 + index)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 text-slate-500 hover:text-accent-purple transition-all"
                  title="Copy to clipboard"
                >
                  {copiedIndex === 100 + index ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/analysis/new" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-cyan to-primary-400 text-dark-900 font-medium rounded-lg transition-all duration-200 shadow-glow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </motion.button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'rgba(34, 211, 238, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-dark-700/50 hover:bg-dark-700 text-slate-300 font-medium rounded-lg transition-all duration-200 border border-dark-600 hover:border-accent-cyan/50"
            >
              Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <AnalysisContent />
    </ProtectedRoute>
  );
}
