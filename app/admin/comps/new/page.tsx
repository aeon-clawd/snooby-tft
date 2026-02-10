"use client";

import CompBuilder from '@/components/admin/CompBuilder';
import Link from 'next/link';

export default function NewCompPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/comps" className="text-blue-300 hover:text-blue-200">
              ← Back to Comps
            </Link>
            <h1 className="text-2xl font-bold text-white">Create New Comp</h1>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CompBuilder mode="create" />
      </main>
    </div>
  );
}
