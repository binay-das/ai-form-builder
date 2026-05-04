import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const forms = await prisma.form.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("[FORMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


