"use client";
import { useState, useEffect, useCallback } from "react";
import Script from "next/script";

const SLOTS = [
    { value: "22:00", label: "10:00 PM" },
    { value: "22:30", label: "10:30 PM" },
    { value: "23:00", label: "11:00 PM" },
    { value: "23:30", label: "11:30 PM" },
    { value: "00:00", label: "12:00 AM" },
    { value: "00:30", label: "12:30 AM" },
    { value: "01:00", label: "1:00 AM" },
    { value: "01:30", label: "1:30 AM" },
    { value: "02:00", label: "2:00 AM" },
    { value: "02:30", label: "2:30 AM" },
];

export default function Booking() {
    const [date, setDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const today = new Date();
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Fetch booked slots when date changes
    const fetchBookedSlots = useCallback(async (d) => {
        if (!d) return;
        try {
            const res = await fetch(`/api/slots?date=${d}`);
            const data = await res.json();
            setBookedSlots(data.booked || []);
        } catch { setBookedSlots([]); }
    }, []);

    useEffect(() => { if (date) fetchBookedSlots(date); }, [date, fetchBookedSlots]);

    const isFormValid = date && selectedSlot && form.name.trim() && form.email.trim() && form.topic.trim();

    const formatDate = (d) => {
        const dt = new Date(d + "T00:00:00");
        return dt.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    };

    const handlePay = async () => {
        if (!isFormValid) return;
        setLoading(true);

        try {
            // Step 1: Create Razorpay order
            const orderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 50000 }), // 500 INR in paise
            });
            const order = await orderRes.json();
            if (!order.id) throw new Error("Failed to create order");

            // Step 2: Open Razorpay checkout
            const slotLabel = SLOTS.find((s) => s.value === selectedSlot)?.label || selectedSlot;
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: 50000,
                currency: "INR",
                name: "Rumman Ahmad",
                description: `Consultation: ${formatDate(date)} at ${slotLabel} IST`,
                order_id: order.id,
                handler: async function (response) {
                    // Step 3: Verify payment & block slot
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                booking: { date, slot: selectedSlot, slotLabel, ...form },
                            }),
                        });
                        const result = await verifyRes.json();
                        if (result.success) {
                            setSuccess(true);
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch {
                        alert("Error verifying payment. Please contact support.");
                    }
                    setLoading(false);
                },
                prefill: { name: form.name, email: form.email, contact: form.phone },
                theme: { color: "#2bd284" },
                modal: { ondismiss: () => setLoading(false) },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert("Error initiating payment: " + err.message);
            setLoading(false);
        }
    };

    const reset = () => {
        setDate("");
        setSelectedSlot(null);
        setForm({ name: "", email: "", phone: "", topic: "" });
        setBookedSlots([]);
        setSuccess(false);
    };

    if (success) {
        return (
            <div className="booking-success">
                <div className="booking-success-icon">🎉</div>
                <h3>Booking Confirmed!</h3>
                <p>Payment received. You&apos;ll get a confirmation email shortly at {form.email}.</p>
                <button className="booking-reset-btn" onClick={reset}>Book Another Slot</button>
            </div>
        );
    }

    return (
        <div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <h2 className="section-title">Book a Consultation Slot</h2>
            <p className="t-secondary">Want to discuss a project, get career advice, or chat about AI/ML? Book a 30-minute session with me.</p>

            {/* Info Cards */}
            <div className="booking-info-grid" style={{ marginTop: 24 }}>
                <div className="booking-info-card">
                    <div className="booking-info-icon"><i className="fa-regular fa-clock" /></div>
                    <div className="booking-info-label">Available Hours</div>
                    <div className="booking-info-value">10:00 PM – 3:00 AM IST</div>
                </div>
                <div className="booking-info-card">
                    <div className="booking-info-icon"><i className="fa-regular fa-hourglass-half" /></div>
                    <div className="booking-info-label">Duration</div>
                    <div className="booking-info-value">30 Minutes</div>
                </div>
                <div className="booking-info-card">
                    <div className="booking-info-icon"><i className="fa-solid fa-indian-rupee-sign" /></div>
                    <div className="booking-info-label">Price per Slot</div>
                    <div className="booking-info-value">₹500</div>
                </div>
            </div>

            {/* Step 1: Date */}
            <div className="booking-step"><div className="booking-step-number">1</div><h4 className="booking-step-title">Pick a Date</h4></div>
            <input type="date" className="booking-date-input" value={date} min={minDate} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} />

            {/* Step 2: Slot */}
            <div className="booking-step"><div className="booking-step-number">2</div><h4 className="booking-step-title">Select a Time Slot</h4></div>
            <div className="slot-grid">
                {SLOTS.map((s) => {
                    const isBooked = bookedSlots.includes(s.value);
                    return (
                        <button
                            key={s.value}
                            className={`slot-btn${selectedSlot === s.value ? " selected" : ""}`}
                            disabled={isBooked}
                            onClick={() => setSelectedSlot(s.value)}
                            title={isBooked ? "Already booked" : ""}
                        >
                            {s.label}
                            {isBooked && <span style={{ display: "block", fontSize: "0.7em", opacity: 0.6 }}>Booked</span>}
                        </button>
                    );
                })}
            </div>

            {/* Step 3: Form */}
            <div className="booking-step"><div className="booking-step-number">3</div><h4 className="booking-step-title">Your Details</h4></div>
            <div className="booking-form">
                <div className="booking-form-group">
                    <label><i className="fa-regular fa-user" style={{ marginRight: 8 }} />Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
                </div>
                <div className="booking-form-group">
                    <label><i className="fa-regular fa-envelope" style={{ marginRight: 8 }} />Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required />
                </div>
                <div className="booking-form-group">
                    <label><i className="fa-regular fa-phone" style={{ marginRight: 8 }} />Phone (Optional)</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                </div>
                <div className="booking-form-group">
                    <label><i className="fa-regular fa-message" style={{ marginRight: 8 }} />Topic / Message *</label>
                    <textarea value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} rows={4} placeholder="What would you like to discuss?" required />
                </div>
            </div>

            {/* Summary */}
            {date && selectedSlot && (
                <div className="booking-summary">
                    <h5><i className="fa-regular fa-calendar-check" style={{ marginRight: 8 }} />Booking Summary</h5>
                    <div className="booking-summary-row"><span>Date:</span><span>{formatDate(date)}</span></div>
                    <div className="booking-summary-row"><span>Time:</span><span>{SLOTS.find((s) => s.value === selectedSlot)?.label} IST (30 min)</span></div>
                    <div className="booking-summary-row"><span>Duration:</span><span>30 min</span></div>
                    <div className="booking-summary-row booking-summary-total"><span>Total:</span><span>₹500</span></div>
                </div>
            )}

            <button className="booking-submit-btn" disabled={!isFormValid || loading} onClick={handlePay}>
                {loading ? (
                    <><i className="fa-regular fa-spinner fa-spin" style={{ marginRight: 8 }} />Processing...</>
                ) : (
                    <><i className="fa-regular fa-credit-card" style={{ marginRight: 8 }} />Pay ₹500 &amp; Confirm Booking</>
                )}
            </button>
        </div>
    );
}
