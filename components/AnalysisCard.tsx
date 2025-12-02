'use client';

import React from 'react';
import Link from 'next/link';
import { AnalysisDocument } from '@/types';
import { motion } from 'framer-motion';

interface AnalysisCardProps {
  analysis: AnalysisDocument;
}

function getScoreColor(score: number): { text: string; bg: string; glow: string } {
  if (score >= 75) return { 
    text: 'text-emerald-400', 
    bg: 'from-emerald-500/20 to-green-500/20',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]'
  };
  if (score >= 50) return { 
    text: 'text-amber-400', 
    bg: 'from-amber-500/20 to-yellow-500/20',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
  };
  return { 
    text: 'text-rose-400', 
    bg: 'from-rose-500/20 to-red-500/20',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]'
  };
}

function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-gradient-to-r from-emerald-500 to-green-400';
  if (score >= 50) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
  return 'bg-gradient-to-r from-rose-500 to-red-400';
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  const scoreColors = getScoreColor(analysis.score);
  
  return (
    <Link href={`/analysis/${analysis.id}`}>
      <motion.div 
        whileHover={{ y: -4, boxShadow: '0 0 30px rgba(34, 211, 238, 0.15)' }}
        className="glass-strong rounded-xl p-6 border border-dark-600/50 hover:border-accent-cyan/30 transition-all duration-300 cursor-pointer h-full"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {analysis.jobTitle}
            </h3>
            {analysis.company && (
              <p className="text-slate-400 text-sm mt-1">{analysis.company}</p>
            )}
            <p className="text-slate-500 text-xs mt-2">
              {formatDate(analysis.createdAt)}
            </p>
          </div>
          
          <motion.div 
            className="ml-4 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${scoreColors.bg} ${scoreColors.glow} border border-dark-600/50`}>
              <span className={`text-lg font-bold ${scoreColors.text}`}>{analysis.score}</span>
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.score}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full ${getScoreBgColor(analysis.score)}`}
            />
          </div>
        </div>

        {/* Summary preview */}
        <p className="text-slate-400 text-sm mt-4 line-clamp-2">
          {analysis.feedbackSummary}
        </p>

        {/* Quick stats */}
        <div className="flex items-center space-x-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-accent-cyan/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {analysis.interviewQuestions.length} Interview Q&apos;s
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-accent-purple/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {analysis.applicationQuestions.length} Application Q&apos;s
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
