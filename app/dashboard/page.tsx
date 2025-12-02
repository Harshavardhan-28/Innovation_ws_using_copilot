'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import AnalysisCard from '@/components/AnalysisCard';
import { getUserAnalyses } from '@/lib/firestore';
import { AnalysisDocument } from '@/types';
import { motion } from 'framer-motion';

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

function DashboardContent() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalyses() {
      if (!user) return;
      
      try {
        const userAnalyses = await getUserAnalyses(user.uid);
        setAnalyses(userAnalyses);
      } catch (err) {
        console.error('Error fetching analyses:', err);
        setError('Failed to load analyses');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-accent-cyan animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-accent-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-slate-400">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back, <span className="text-accent-cyan">{user?.email?.split('@')[0]}</span>!
          </p>
        </div>
        <Link href="/analysis/new">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-cyan to-primary-400 text-dark-900 font-medium rounded-lg transition-all duration-200 shadow-glow"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </motion.button>
        </Link>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Empty State */}
      {analyses.length === 0 && !error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 glass-strong rounded-full flex items-center justify-center mx-auto mb-6 border border-dark-600/50">
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">No analyses yet</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Start by creating your first resume analysis. Our AI will help you understand how well your resume matches job requirements.
          </p>
          <Link href="/analysis/new">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-cyan to-primary-400 text-dark-900 font-medium rounded-lg transition-all duration-200 shadow-glow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Analysis
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Analyses Grid */}
      {analyses.length > 0 && (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              variants={fadeInUp}
              transition={{ delay: index * 0.05 }}
            >
              <AnalysisCard analysis={analysis} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
