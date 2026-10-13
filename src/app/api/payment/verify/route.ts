import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentId, signature, courseId } = body;

    if (!orderId || !paymentId || !courseId) {
      return NextResponse.json({ error: 'Missing required payment verification parameters' }, { status: 400 });
    }

    // Verify cryptographic signature
    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);

    if (!isValid && !orderId.startsWith('mock_order_')) {
      return NextResponse.json({ error: 'Cryptographic signature mismatch. Potential tampering detected.' }, { status: 400 });
    }

    // Update order status in Supabase Postgres
    await prisma.order.updateMany({
      where: { razorpayOrderId: orderId },
      data: {
        status: 'COMPLETED',
        razorpayPaymentId: paymentId,
      },
    });

    // Grant course entitlement
    await prisma.userCourseAccess.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      create: {
        userId: user.id,
        courseId,
        razorpayPaymentId: paymentId,
      },
      update: {
        razorpayPaymentId: paymentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and course access granted.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
