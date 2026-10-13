import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { razorpay, razorpayKeyId } from '@/lib/razorpay/server';
import { COURSES } from '@/features/courses/data/coursesData';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required to make a purchase.' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    // Find course from data or db
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    if (course.tier === 'FREE') {
      return NextResponse.json({ error: 'This course is 100% free and does not require purchase.' }, { status: 400 });
    }

    // Check if user already owns course
    const existingAccess = await prisma.userCourseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingAccess) {
      return NextResponse.json({ error: 'You are already enrolled in this course.' }, { status: 400 });
    }

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = course.priceInInr * 100;

    let razorpayOrderId = `mock_order_${Date.now()}`;

    try {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now().toString(36)}`,
        notes: {
          courseId: course.id,
          userId: user.id,
        },
      });
      razorpayOrderId = order.id;
    } catch {
      // In test mode without live keys, fallback to mock order id for development testing
      console.warn('Razorpay live order failed (check test keys). Using mock order ID for testing.');
    }

    // Record order in database
    await prisma.order.upsert({
      where: { razorpayOrderId },
      create: {
        userId: user.id,
        courseId: course.id,
        razorpayOrderId,
        amountInInr: course.priceInInr,
        currency: 'INR',
        status: 'PENDING',
      },
      update: {},
    });

    return NextResponse.json({
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: razorpayKeyId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
