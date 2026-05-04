import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function getAuthenticatedForm(formId: string, userId: string) {
  return await prisma.form.findFirst({
    where: { id: formId, userId },
  });
}

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const form = await getAuthenticatedForm(params.formId, session.user.id);
    if (!form) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, schema, isPublished, isArchived } = body;

    const form = await prisma.form.update({
      where: {
        id: params.formId,
        userId: session.user.id
      },
      data: {
        title, description,
        schema, isPublished,
        isArchived
      }
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    await prisma.form.delete({
      where: {
        id: params.formId,
        userId: session.user.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FORM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}