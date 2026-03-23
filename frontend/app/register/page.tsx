"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import content from "@/content.json";

const inputCls =
  "w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#A0A0B8] focus:outline-none transition-all";
const inputStyle = {
  background: "#13111A",
  border: "1px solid rgba(224, 64, 251, 0.2)",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { full_name: name, email, password });
      router.push("/login");
    } catch {
      setError("Registration failed. This email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#F50057";
    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245, 0, 87, 0.25)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(224, 64, 251, 0.2)";
    e.currentTarget.style.boxShadow = "";
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col justify-center py-12 px-6 animate-fade-in">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">{content.register.heading}</h2>
          <p className="text-[#A0A0B8] mt-2 text-sm">{content.register.subheading}</p>
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
              <label className="label">Full Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={content.register.namePlaceholder}
                className={inputCls}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.register.emailPlaceholder}
                className={inputCls}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={content.register.passwordPlaceholder}
                className={inputCls}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 rounded-lg mt-2 font-semibold disabled:opacity-50"
            >
              {loading ? "Creating Account..." : content.register.submitButton}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[#A0A0B8] text-sm">
            {content.register.hasAccountText}{" "}
            <Link
              href="/login"
              className="text-[#E040FB] hover:text-[#F50057] font-medium transition-colors"
            >
              {content.register.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
