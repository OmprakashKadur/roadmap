'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/features/shared/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthModal } from '@/features/auth/hooks/useAuthModal';

interface RazorpayCheckoutButtonProps {
  courseId: string;
  courseTitle: string;
  amountInInr: number;
  className?: string;
}

export function RazorpayCheckoutButton({
  courseId,
  courseTitle,
  amountInInr,
  className,
}: RazorpayCheckoutButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    // 1. Enforce login first!
    if (!user) {
      openLogin('login', 'Please sign in or create an account to purchase this course.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Load script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Could not load Razorpay payment gateway. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      // 3. Create Order on Next.js backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // 4. Launch Razorpay modal
      interface RazorpayResponse {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }

      const RazorpayConstructor = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      const rzp = new RazorpayConstructor({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FDE Career Roadmap',
        description: `Enrollment in: ${courseTitle}`,
        order_id: orderData.orderId,
        prefill: {
          email: user.email || '',
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response: RazorpayResponse) => {
          // 5. Verify payment signature on backend
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            alert('🎉 Payment Successful! Course has been unlocked.');
            router.refresh();
          } else {
            alert(`Payment verification failed: ${verifyData.error || 'Signature mismatch'}`);
          }
        },
      });

      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout encountered an error';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleCheckout}
      isLoading={isLoading}
      className={`text-sm font-semibold gap-2 border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-600/20 ${className}`}
    >
      <Sparkles className="w-4 h-4 text-amber-400" />
      Unlock Full Course (₹{amountInInr})
    </Button>
  );
}
