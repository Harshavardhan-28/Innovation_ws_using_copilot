'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          {/* Hero Section */}
          <motion.div variants={fadeInUp} className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-dark-700/80 border border-dark-600 text-accent-cyan backdrop-blur-sm">
              <span className="w-2 h-2 bg-accent-cyan rounded-full mr-2 animate-pulse" />
              Powered by Google Gemini AI
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-white">Land Your Dream Job with</span>
            <span className="gradient-text block mt-2">AI-Powered Analysis</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10"
          >
            Upload your resume, paste a job description, and get instant feedback. 
            Our AI analyzes your fit, generates a match score, and prepares you with 
            tailored interview questions.
          </motion.p>

          {/* CTA Buttons - Different based on auth state */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {loading ? (
              // Loading state
              <div className="h-14 w-48 rounded-xl shimmer" />
            ) : user ? (
              // Signed in state
              <>
                <Link href="/analysis/new">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(34, 211, 238, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-dark-900 bg-gradient-to-r from-accent-cyan to-primary-400 rounded-xl transition-all duration-300 shadow-glow"
                  >
                    New Analysis
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: 'rgba(34, 211, 238, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-300 bg-dark-700/50 hover:bg-dark-700 rounded-xl transition-all duration-300 border border-dark-600 hover:border-accent-cyan/50 backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </motion.button>
                </Link>
              </>
            ) : (
              // Signed out state
              <>
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(34, 211, 238, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-dark-900 bg-gradient-to-r from-accent-cyan to-primary-400 rounded-xl transition-all duration-300 shadow-glow"
                  >
                    Get Started Free
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </Link>
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: 'rgba(34, 211, 238, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-300 bg-dark-700/50 hover:bg-dark-700 rounded-xl transition-all duration-300 border border-dark-600 hover:border-accent-cyan/50 backdrop-blur-sm"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconColor="from-green-400 to-emerald-500"
              title="Match Score"
              description="Get a 0-100 score showing how well your resume matches the job requirements."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconColor="from-accent-cyan to-blue-500"
              title="Interview Prep"
              description="Receive tailored interview questions based on the job and your experience."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              iconColor="from-accent-purple to-pink-500"
              title="Application Help"
              description="Get guidance for cover letters and 'why this role' essay questions."
            />
          </motion.div>

          {/* How It Works */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 mb-12">Four simple steps to your dream job</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Sign Up', desc: 'Create your free account', delay: 0 },
                { step: '2', title: 'Add Job Details', desc: 'Paste the job description', delay: 0.1 },
                { step: '3', title: 'Upload Resume', desc: 'Upload PDF or Word doc', delay: 0.2 },
                { step: '4', title: 'Get Results', desc: 'Receive AI-powered insights', delay: 0.3 },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="glass-strong rounded-xl p-6 h-full border border-dark-600/50 group-hover:border-accent-cyan/30 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-accent-purple text-white rounded-xl flex items-center justify-center font-bold mb-4 mx-auto shadow-glow-sm">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 glass-strong rounded-2xl p-8 sm:p-12 border border-dark-600/50"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {user ? 'Ready for your next analysis?' : 'Ready to stand out?'}
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              {user 
                ? 'Continue optimizing your job applications with AI-powered insights.'
                : 'Join thousands of job seekers using AI to optimize their applications and land interviews faster.'
              }
            </p>
            <Link href={user ? '/analysis/new' : '/auth'}>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(34, 211, 238, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-dark-900 bg-gradient-to-r from-accent-cyan to-primary-400 rounded-xl transition-all duration-300 shadow-glow"
              >
                {user ? 'Start New Analysis' : 'Analyze Your Resume Now'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  iconColor,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5, boxShadow: '0 0 30px rgba(34, 211, 238, 0.15)' }}
      className="glass-strong rounded-xl p-6 border border-dark-600/50 hover:border-accent-cyan/30 transition-all duration-300"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center mb-4 mx-auto text-white shadow-glow-sm`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}
