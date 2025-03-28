import User from "../../../model/user";
import Connection from "../../../database/connection";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await Connection();

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const newUser = new User({ email, password }); 
    await newUser.save();

    await newUser.save();
    console.log("✅ User saved successfully!");

    return NextResponse.json(
      { message: "Signup successful", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
