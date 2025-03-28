import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        return NextResponse.next(); 
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/details"], 
};
