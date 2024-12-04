import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        const response = await fetch(`http://backend-dev:3001/api/bookings/${userId}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json({ error: "user not found" }, { status: 404 });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}
