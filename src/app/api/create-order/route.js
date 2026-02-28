import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { amount } = await request.json();

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
            amount: amount || 50000, // 500 INR in paise
            currency: "INR",
            receipt: `booking_${Date.now()}`,
        });

        return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
