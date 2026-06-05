import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeSchema } from "@/lib/schema-validation";
import { ResponsesClient } from "@/components/ResponsesClient";

interface ResponsesPageProps {
  params: Promise<{ formId: string }>;
}

export default async function ResponsesPage({ params }: ResponsesPageProps) {
  const { formId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const form = await prisma.form.findFirst({
    where: { id: formId, userId: session.user.id },
  });

  if (!form) redirect("/dashboard");

  const responses = await prisma.response.findMany({
    where: { formId },
    orderBy: { submittedAt: "desc" },
  });

  const normalized = normalizeSchema(form.schema as any);

  return (
    <ResponsesClient
      formTitle={form.title}
      fields={normalized.fields}
      initialResponses={responses.map((r) => ({
        ...r,
        answers: r.answers as Record<string, string>,
        submittedAt: r.submittedAt.toISOString(),
      }))}
    />
  );
}