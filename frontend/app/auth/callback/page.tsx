"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    const role  = params.get("role");
    const name  = params.get("name") ?? "";

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    // Set cookies with explicit path and max-age
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `name=${encodeURIComponent(name)}; path=/; max-age=${maxAge}; SameSite=Lax`;

    // Also persist to localStorage so client-side auth helpers (Navbar, etc.) work
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    // Small delay to ensure cookies are written before navigation
    setTimeout(() => {
      router.replace(role === "admin" ? "/admin" : "/recruiter");
    }, 100);
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
      <p className="text-[#A0A0B8] text-sm animate-pulse">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
          <p className="text-[#A0A0B8] text-sm animate-pulse">Signing you in...</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
