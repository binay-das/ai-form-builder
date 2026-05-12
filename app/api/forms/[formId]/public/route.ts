import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ formId: string }> };

// Step 1: POST response endpoint with basic validation
export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { formId } = await params;

    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) return new NextResponse("Not Found", { status: 404 });
    if (!form.isPublished) return new NextResponse("Form not published", { status: 404 });

    const body = await req.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return new NextResponse("Answers are required", { status: 400 });
    }

    const response = await prisma.response.create({
      data: {
        formId,
        userId: "anonymous",
        answers: answers as any,
      },
    });

    await prisma.form.update({
      where: { id: formId },
      data: { submissionCount: { increment: 1 } },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[PUBLIC_FORM_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}