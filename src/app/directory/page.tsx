import React from 'react'
import { DirectoryList } from '@/components/DirectoryList'

export const metadata = {
  title: 'Directory - BizConnect',
}

export default function DirectoryPage() {
  return (
    <div className="py-12">
       <DirectoryList />
    </div>
  )
}