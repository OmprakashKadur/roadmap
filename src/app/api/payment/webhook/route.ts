import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// POST /api/payment/webhook
// Handles asynchronous Razorpay webhook events (payment.captured, order.paid)
export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // If webhook secret is configured, verify HMAC signature
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyText)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity;
      const orderId = payment?.order_id;
      const paymentId = payment?.id;

      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: orderId },
        });

        if (order && order.status !== 'COMPLETED') {
          // Complete order
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'COMPLETED',
              razorpayPaymentId: paymentId || order.razorpayPaymentId,
            },
          });

          // Idempotently grant user course access
          await prisma.userCourseAccess.upsert({
            where: {
              userId_courseId: {
                userId: order.userId,
                courseId: order.courseId,
              },
            },
            update: {
              razorpayPaymentId: paymentId || order.razorpayPaymentId,
            },
            create: {
              userId: order.userId,
              courseId: order.courseId,
              razorpayPaymentId: paymentId || order.razorpayPaymentId,
            },
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
