"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import content from "@/content.json";

const inputCls =
  "w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#A0A0B8] focus:outline-none transition-all";
const inputStyle = {
  background: "#13111A",
  border: "1px solid rgba(224, 64, 251, 0.2)",
};

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
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col justify-center py-12 px-6 animate-fade-in">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">{content.login.heading}</h2>
          <p className="text-[#A0A0B8] mt-2 text-sm">{content.login.subheading}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8"
          style={{
            background: "#13111A",
            border: "1px solid rgba(224, 64, 251, 0.2)",
            boxShadow: "0 0 40px rgba(224, 64, 251, 0.05)",
          }}
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.login.emailPlaceholder}
                className={inputCls}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F50057";
                  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245, 0, 87, 0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(224, 64, 251, 0.2)";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={content.login.passwordPlaceholder}
                className={inputCls}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F50057";
                  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245, 0, 87, 0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(224, 64, 251, 0.2)";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 rounded-lg mt-2 font-semibold disabled:opacity-50"
            >
              {loading ? "Signing in..." : content.login.submitButton}
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[rgba(224,64,251,0.15)]" />
            <span className="mx-4 text-[#A0A0B8] text-xs">or</span>
            <div className="flex-1 border-t border-[rgba(224,64,251,0.15)]" />
          </div>

          <button
            type="button"
            onClick={() => { window.location.href = "http://localhost:8000/auth/google"; }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-medium text-sm transition-all hover:shadow-md"
            style={{
              background: "#ffffff",
              border: "1px solid #4285F4",
              color: "#3c4043",
              fontFamily: "'Google Sans', Roboto, sans-serif",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[#A0A0B8] text-sm">
            {content.login.noAccountText}{" "}
            <Link
              href="/register"
              className="text-[#E040FB] hover:text-[#F50057] font-medium transition-colors"
            >
              {content.login.registerLink}
            </Link>
          </p>
          <Link
            href="/"
            className="inline-block text-[#A0A0B8] hover:text-white text-sm transition-colors"
          >
            {content.login.guestLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
