import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Connect with Top Professionals
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Build your network with vetted professionals in your industry
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary"
          >
            Get Started
          </Link>
          <Link
            href="/directory"
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white"
          >
            Browse Directory
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
          <p className="text-gray-600">
            All members are reviewed and approved before appearing in our directory
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-bold mb-2">Easy Networking</h3>
          <p className="text-gray-600">
            Find and connect with professionals that match your needs
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Quick Registration</h3>
          <p className="text-gray-600">
            Join in minutes with our simple registration process
          </p>
        </div>
      </section>
    </div>
  )
}
