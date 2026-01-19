'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden px-3 py-2 text-primary hover:text-secondary transition-colors"
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <div className="px-4 py-2 space-y-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded"
            >
              Home
            </Link>
            <Link
              href="/directory"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded"
            >
              Directory
            </Link>
            <Link
              href="/apply"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded"
            >
              Apply
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
            >
              Join
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
