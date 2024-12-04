import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const response = await fetch(`http://backend-dev:3001/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(await request.json()),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const booking = await response.json();
        
        return NextResponse.json(booking, { status: 200 });

    } catch (error) {
        console.error("Error uploading new booking:", error);
        return NextResponse.json({ error: "Failed to upload new booking" }, { status: 500 });
    }
}

