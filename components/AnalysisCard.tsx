'use client';

import React from 'react';
import Link from 'next/link';
import { AnalysisDocument } from '@/types';

interface AnalysisCardProps {
  analysis: AnalysisDocument;
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600 bg-green-100';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Link href={`/analysis/${analysis.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {analysis.jobTitle}
            </h3>
            {analysis.company && (
              <p className="text-gray-600 text-sm mt-1">{analysis.company}</p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              {formatDate(analysis.createdAt)}
            </p>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${getScoreColor(analysis.score)}`}>
              <span className="text-lg font-bold">{analysis.score}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBgColor(analysis.score)} transition-all duration-500`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
        </div>

        {/* Summary preview */}
        <p className="text-gray-600 text-sm mt-4 line-clamp-2">
          {analysis.feedbackSummary}
        </p>

        {/* Quick stats */}
        <div className="flex items-center space-x-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {analysis.interviewQuestions.length} Interview Q&apos;s
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {analysis.applicationQuestions.length} Application Q&apos;s
          </span>
        </div>
      </div>
    </Link>
  );
}
