import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { validateSchema, normalizeSchema, CURRENT_SCHEMA_VERSION } from "@/lib/schema-validation";
import { FormField } from "@/types/form";


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


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, schema } = body;

    if (!title || typeof title !== "string") {
      return new NextResponse("Title is required", { status: 400 });
    }

    let validatedSchema: FormField[] = [];
    if (schema !== undefined && schema !== null) {
      if (!validateSchema(schema)) {
        return new NextResponse("Invalid schema format", { status: 400 });
      }
      validatedSchema = normalizeSchema(schema).fields;
    }

    const form = await prisma.form.create({
      data: {
        userId: session.user.id,
        title,
        description: description || "",
        schema: validatedSchema as any,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}