'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AnalysisForm from '@/components/AnalysisForm';
import Link from 'next/link';
import { motion } from 'framer-motion';

function NewAnalysisContent() {
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
          <li className="text-white font-medium">New Analysis</li>
        </ol>
      </motion.nav>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">New Resume Analysis</h1>
        <p className="text-slate-400 mt-2">
          Enter the job details and your resume to get AI-powered insights and feedback.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnalysisForm />
      </motion.div>
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
