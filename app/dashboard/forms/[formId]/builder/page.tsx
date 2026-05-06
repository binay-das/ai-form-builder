import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BuilderClient } from "@/components/builder/BuilderClient";
import { prisma } from "@/lib/prisma";
import { normalizeSchema } from "@/lib/schema-validation";
import { FormField } from "@/types/form";

interface BuilderPageProps {
  params: { formId: string };
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const form = await prisma.form.findFirst({
    where: { id: params.formId, userId: session.user.id },
  });

  if (!form) redirect("/dashboard");

  const normalized = normalizeSchema(form.schema as FormField[]);

  return (
    <BuilderClient
      formId={form.id}
      formTitle={form.title}
      initialFields={normalized.fields}
    />
  );
}
