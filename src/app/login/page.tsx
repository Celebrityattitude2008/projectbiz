import React from 'react'
import { LoginForm } from '@/components/LoginForm'

export const metadata = {
  title: 'Login - BizConnect',
  description: 'Sign in to your BizConnect account',
}

export default function LoginPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sign in to your account to access your professional network
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
