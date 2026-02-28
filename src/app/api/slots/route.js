import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BOOKED_SLOTS_PATH = path.join(process.cwd(), "data", "booked-slots.json");

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        if (!date) {
            return NextResponse.json({ booked: [] });
        }

        let slots = {};
        try {
            if (fs.existsSync(BOOKED_SLOTS_PATH)) {
                slots = JSON.parse(fs.readFileSync(BOOKED_SLOTS_PATH, "utf-8"));
            }
        } catch { /* empty */ }

        return NextResponse.json({ booked: slots[date] || [] });
    } catch (error) {
        console.error("Error reading slots:", error);
        return NextResponse.json({ booked: [] });
    }
}
