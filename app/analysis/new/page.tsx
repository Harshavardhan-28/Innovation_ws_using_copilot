'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AnalysisForm from '@/components/AnalysisForm';
import Link from 'next/link';

function NewAnalysisContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">New Analysis</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Resume Analysis</h1>
        <p className="text-gray-600 mt-2">
          Enter the job details and your resume to get AI-powered insights and feedback.
        </p>
      </div>

      {/* Form */}
      <AnalysisForm />
    </div>
  );
}

export default function NewAnalysisPage() {
  return (
    <ProtectedRoute>
      <NewAnalysisContent />
    </ProtectedRoute>
  );
}
