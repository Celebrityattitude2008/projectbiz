import React from 'react'
import { RegisterForm } from '@/components/RegisterForm'

export const metadata = {
  title: 'Register - BizConnect',
  description: 'Create your professional profile',
}

export default function RegisterPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Join BizConnect</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create your professional profile and get discovered by potential connections
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
