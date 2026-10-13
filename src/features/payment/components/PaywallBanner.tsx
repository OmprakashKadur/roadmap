'use client';

import { Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RazorpayCheckoutButton } from './RazorpayCheckoutButton';

interface PaywallBannerProps {
  courseId: string;
  courseTitle: string;
  priceInInr: number;
  lessonTitle: string;
}

export function PaywallBanner({
  courseId,
  courseTitle,
  priceInInr,
  lessonTitle,
}: PaywallBannerProps) {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-10 shadow-2xl text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            Pro Module • Access Locked
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Unlock Full Access to {courseTitle}
          </h2>
          <p className="text-sm text-slate-300">
            You are viewing <span className="text-white font-semibold">&ldquo;{lessonTitle}&rdquo;</span>. Unlock this lesson and all advanced modules in this course with lifetime access.
          </p>
        </div>

        {/* Value Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left py-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Full HD Video Walkthroughs</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Production Solution Code</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Client Architecture Schematics</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Syncs Directly with FDE Roadmap</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RazorpayCheckoutButton
            courseId={courseId}
            courseTitle={courseTitle}
            amountInInr={priceInInr}
            className="w-full sm:w-auto"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secured by Razorpay • UPI, Cards, Netbanking accepted</span>
        </div>
      </div>
    </div>
  );
}
