import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get("flightId");

    if (!flightId) {
        return NextResponse.json({ error: "flightId is required" }, { status: 400 });
    }

    try {
        const response = await fetch(`http://backend-dev:3001/api/flights/${flightId}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json({ error: "flight not found" }, { status: 404 });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching flight:", error);
        return NextResponse.json({ error: "Failed to fetch flight" }, { status: 500 });
    }
}
