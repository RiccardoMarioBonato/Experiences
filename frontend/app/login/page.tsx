"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import content from "@/content.json";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token, role, full_name } = res.data;
      saveAuth(access_token, role, full_name);

      if (role === "admin") router.push("/admin");
      else if (role === "recruiter") router.push("/recruiter");
      else router.push("/");
    } catch {
      setError(content.login.errorMessages.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">{content.login.heading}</h2>
          <p className="text-gray-400 mt-2 text-sm">{content.login.subheading}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.login.emailPlaceholder}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={content.login.passwordPlaceholder}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? "Signing in..." : content.login.submitButton}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-400 text-sm">
            {content.login.noAccountText}{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              {content.login.registerLink}
            </Link>
          </p>
          <Link href="/" className="inline-block text-gray-500 hover:text-gray-300 text-sm transition-colors">
            {content.login.guestLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
