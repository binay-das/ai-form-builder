import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen ">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold">
          FormCraft AI
        </h1>
        <p className="  xl max-w-md mx-auto">
          The next generation of AI-powered form building. Create, deploy, and analyze with ease.
        </p>
        <div className="pt-8">
          <Link
            href="/api/auth/signin"
            className="px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
