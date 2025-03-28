import Connection from "../../../database/connection";
import User from "../../../model/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        await Connection(); 

        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        if (!decoded.email) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        const user = await User.findOneAndDelete({ email: decoded.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
