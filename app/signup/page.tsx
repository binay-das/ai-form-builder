"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, Mail } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/api/auth/signin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  [#0b1326] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%]  indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%]  violet-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="  center mb-8 space-y-2">
          <h1 className="  4xl font-bold  gradient-to-r from-indigo-400 to-violet-400  clip-text   transparent flex items-center justify-center">
            <Sparkles className="h-8 w-8 mr-3   indigo-400" />
            FormCraft AI
          </h1>
          <p className="  [#908fa0]">Create your account to start building.</p>
        </div>

        <div className=" white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className=" rose-500/10 border border-rose-500/20   rose-400 px-4 py-3 rounded-xl   sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="  sm font-medium   [#dae2fd]">Full Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full  white/5 border border-white/10 rounded-xl py-3 px-4   white placeholder-[#464554] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="  sm font-medium   [#dae2fd]">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full  white/5 border border-white/10 rounded-xl py-3 px-4   white placeholder-[#464554] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="  sm font-medium   [#dae2fd]">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full  white/5 border border-white/10 rounded-xl py-3 px-4   white placeholder-[#464554] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 rounded-xl  gradient-to-r from-indigo-600 to-violet-600   white font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center   xs uppercase">
              <span className=" [#0b1326] px-2   [#908fa0]">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-3 px-4 rounded-xl border border-white/10   white hover: white/5 transition-all font-medium">
              GitHub
            </button>
            <button className="flex items-center justify-center py-3 px-4 rounded-xl border border-white/10   white hover: white/5 transition-all font-medium">
              <Mail className="h-5 w-5 mr-2" />
              Google
            </button>
          </div>

          <p className="  center   sm   [#908fa0]">
            Already have an account?{" "}
            <Link href="/api/auth/signin" className="  indigo-400 hover:  indigo-300 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
