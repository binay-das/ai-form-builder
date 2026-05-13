import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ formId: string }> };

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { formId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const form = await prisma.form.findFirst({
      where: { id: formId, userId: session.user.id },
    });
    if (!form) return new NextResponse("Not Found", { status: 404 });

    const responses = await prisma.response.findMany({
      where: { formId },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("[RESPONSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}