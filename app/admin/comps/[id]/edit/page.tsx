"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CompBuilder from '@/components/admin/CompBuilder';
import Link from 'next/link';

export default function EditCompPage() {
  const params = useParams();
  const compId = params.id as string;
  
  const [comp, setComp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadComp = async () => {
      try {
        const response = await fetch(`/api/comps/${compId}`);
        const result = await response.json();
        
        if (result.success) {
          setComp(result.data);
        } else {
          setError(result.error);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadComp();
  }, [compId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading comp...</div>
      </div>
    );
  }
  
  if (error || !comp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error || 'Comp not found'}
          </div>
          <Link
            href="/admin/comps"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Comps
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/comps" className="text-blue-300 hover:text-blue-200">
              ← Back to Comps
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Edit: {comp.name}
            </h1>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CompBuilder mode="edit" compId={compId} initialData={comp} />
      </main>
    </div>
  );
}
