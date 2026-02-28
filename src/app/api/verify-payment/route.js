import crypto from "crypto";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BOOKED_SLOTS_PATH = path.join(process.cwd(), "data", "booked-slots.json");

function getBookedSlots() {
    try {
        if (!fs.existsSync(BOOKED_SLOTS_PATH)) return {};
        return JSON.parse(fs.readFileSync(BOOKED_SLOTS_PATH, "utf-8"));
    } catch { return {}; }
}

function saveBookedSlots(data) {
    const dir = path.dirname(BOOKED_SLOTS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BOOKED_SLOTS_PATH, JSON.stringify(data, null, 2));
}

export async function POST(request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking } = await request.json();

        // Verify Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        // Block the slot
        const slots = getBookedSlots();
        if (!slots[booking.date]) slots[booking.date] = [];
        if (!slots[booking.date].includes(booking.slot)) {
            slots[booking.date].push(booking.slot);
        }
        saveBookedSlots(slots);

        // Send email notification via Web3Forms
        try {
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: process.env.WEB3FORMS_ACCESS_KEY || "",
                    subject: `✅ New Booking: ${booking.date} at ${booking.slotLabel} IST`,
                    from_name: "Portfolio Booking System",
                    name: booking.name,
                    email: booking.email,
                    phone: booking.phone || "N/A",
                    message: `Booking Details:\n\nDate: ${booking.date}\nTime: ${booking.slotLabel} IST\nDuration: 30 minutes\nAmount Paid: ₹500\n\nPayment ID: ${razorpay_payment_id}\nOrder ID: ${razorpay_order_id}\n\nTopic: ${booking.topic}`,
                }),
            });
        } catch (emailErr) {
            console.error("Email notification failed:", emailErr);
        }

        return NextResponse.json({ success: true, payment_id: razorpay_payment_id });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
    }
}
