import React from 'react'
import { DirectoryList } from '@/components/DirectoryList'

export const metadata = {
  title: 'Directory - BizConnect',
  description: 'Browse approved professionals in the BizConnect directory',
}

export default function DirectoryPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Directory</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and discover verified professionals in your network
        </p>
      </div>
      <DirectoryList />
    </div>
  )
}
