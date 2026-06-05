import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, newPassword } = await request.json();

    const dataToUpdate: any = {};
    if (name !== undefined) {
      if (name.trim() === "") {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      dataToUpdate.name = name;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
      }
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
