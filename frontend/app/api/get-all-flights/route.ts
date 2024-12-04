import { NextResponse } from "next/server";

export async function GET() {
    const val: string = (process.env.NEXT_PUBLIC_API_URL as string);
    console.log(val);
    const response = await fetch(`http://backend-dev:3001/api/flights`, {
        method: "GET",
        cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data);
}
