import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { validateSchema, normalizeSchema } from "@/lib/schema-validation";
import { FormField } from "@/types/form";

type RouteContext = { params: Promise<{ formId: string }> };

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { formId } = await params;
    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) return new NextResponse("Not Found", { status: 404 });
    if (!form.isPublished) return new NextResponse("Form not published", { status: 403 });

    return NextResponse.json(form);
  } catch (error) {
    console.error("[PUBLIC_FORM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { formId } = await params;

    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) return new NextResponse("Not Found", { status: 404 });
    if (!form.isPublished) return new NextResponse("Form not published", { status: 403 });

    const body = await req.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return new NextResponse("Answers are required", { status: 400 });
    }

    // validate that all required fields have answers
    const fields = normalizeSchema(form.schema as FormField[]).fields;
    const missingRequired: string[] = [];

    for (const field of fields) {
      if (field.required) {
        const answer = answers[field.id];
        if (answer === undefined || answer === null || answer === "") {
          missingRequired.push(field.label);
        }
      }
    }

    if (missingRequired.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", fields: missingRequired },
        { status: 400 }
      );
    }

    // Get session (optional — responses are anonymous unless logged in)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Create response
    const response = await prisma.response.create({
      data: {
        formId,
        userId: userId ?? "anonymous",
        answers: answers as any,
      },
    });

    // increment submission count
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