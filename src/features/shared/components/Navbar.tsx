'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, LayoutDashboard, Terminal, LogOut, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthModal } from '@/features/auth/hooks/useAuthModal';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut, isLoading } = useAuth();
  const { openLogin } = useAuthModal();

  const navLinks = [
    { href: '/roadmap', label: 'Skill Roadmaps', icon: Compass },
    { href: '/courses', label: 'Interactive Courses', icon: BookOpen },
    ...(user ? [{ href: '/dashboard', label: 'Learner Hub', icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090b10]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#0b0d13] rounded-[7px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5 font-mono">
              <span className="text-amber-400">ROADMAP</span>
              <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono font-medium text-slate-400 tracking-wider block -mt-0.5">
              Engineering Skill Trees & Labs
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  isActive
                    ? 'bg-white/[0.08] text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[120px]">{profile?.fullName || user.email?.split('@')[0]}</span>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut()}
                className="text-slate-400 hover:text-rose-400 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openLogin()}
                className="text-slate-300 hover:text-white text-xs font-mono"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => openLogin()}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Go Pro
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
