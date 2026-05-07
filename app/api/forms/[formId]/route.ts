import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { validateSchema, normalizeSchema, CURRENT_SCHEMA_VERSION } from "@/lib/schema-validation";

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

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const { formId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, description, schema, isPublished, isArchived, createVersion } = body;

    if (schema !== undefined && schema !== null) {
      if (!validateSchema(schema)) {
        return new NextResponse("Invalid schema format", { status: 400 });
      }

      const validatedSchema = normalizeSchema(schema);

      if (createVersion) {
        const parentForm = await prisma.form.findFirst({
          where: { id: formId, userId: session.user.id },
        });
        if (!parentForm) return new NextResponse("Form not found", { status: 404 });

        const newVersion = await prisma.form.create({
          data: {
            userId: session.user.id,
            title: title || parentForm.title,
            description: description || parentForm.description,
            schema: validatedSchema.fields as any,
            schemaVersion: CURRENT_SCHEMA_VERSION,
            parentFormId: formId,
          },
        });
        return NextResponse.json(newVersion);
      }

      const form = await prisma.form.update({
        where: { id: formId, userId: session.user.id },
        data: {
          title,
          description,
          schema: validatedSchema.fields as any,
          schemaVersion: CURRENT_SCHEMA_VERSION,
          isPublished,
          isArchived,
        },
      });
      return NextResponse.json(form);
    }

    // No schema — update metadata only
    const form = await prisma.form.update({
      where: { id: formId, userId: session.user.id },
      data: { title, description, isPublished, isArchived },
    });
    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const { formId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    await prisma.form.delete({
      where: { id: formId, userId: session.user.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FORM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}