'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass border-b border-dark-600/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </motion.div>
            <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
              InterviewBuddy
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center space-x-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full shimmer" />
            ) : user ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <Link href="/analysis/new">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 text-sm font-medium text-dark-900 bg-gradient-to-r from-accent-cyan to-primary-400 rounded-lg transition-all duration-200"
                  >
                    New Analysis
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="ml-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-dark-600 hover:border-accent-cyan/50 rounded-lg transition-all duration-200 hover:shadow-glow-sm"
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <NavLink href="/auth">Sign In</NavLink>
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 text-sm font-medium text-dark-900 bg-gradient-to-r from-accent-cyan to-primary-400 rounded-lg transition-all duration-200"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden glass-strong border-t border-dark-600/50"
          >
            <div className="px-4 py-4 space-y-2">
              {loading ? (
                <div className="h-10 shimmer rounded-lg" />
              ) : user ? (
                <>
                  <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/analysis/new" onClick={() => setMobileMenuOpen(false)}>
                    New Analysis
                  </MobileNavLink>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </MobileNavLink>
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 text-sm font-medium text-dark-900 bg-gradient-to-r from-accent-cyan to-primary-400 rounded-lg"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ color: '#22d3ee' }}
        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-accent-cyan rounded-lg transition-colors cursor-pointer"
      >
        {children}
      </motion.span>
    </Link>
  );
}

function MobileNavLink({ 
  href, 
  onClick, 
  children 
}: { 
  href: string; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
      >
        {children}
      </motion.div>
    </Link>
  );
}
