'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { SignupForm } from '@/features/auth/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">FDE Roadmap</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Create your free account</h2>
        <p className="mt-1 text-sm text-slate-400">
          Access the roadmap, take notes, and track your tasks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <SignupForm
            onSuccess={() => router.push('/roadmap')}
            onSwitchToLogin={() => router.push('/login')}
          />
        </div>
      </div>
    </div>
  );
}
