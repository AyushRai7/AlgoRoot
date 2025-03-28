import bcrypt from "bcryptjs";
import User from "../../../model/user";
import Connection from "../../../database/connection";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        await Connection();

        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        return NextResponse.json({ message: "Login successful", success: true }, { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
