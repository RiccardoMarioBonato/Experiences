"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getRole, getName, clearAuth } from "@/lib/auth";
import { Menu, X, User as UserIcon } from "lucide-react";
import content from "@/content.json";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const isAuth = mounted && isAuthenticated();
  const role = mounted ? getRole() : null;
  const name = mounted ? getName() : null;

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`relative text-sm font-medium transition-colors duration-200 group inline-block ${
          active ? "text-[#F50057]" : "text-[#A0A0B8] hover:text-[#F50057]"
        }`}
      >
        {label}
        <span
          className={`absolute -bottom-1 left-0 h-[2px] bg-[#F50057] transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D0D0F]/90 backdrop-blur-md border-b border-[rgba(224,64,251,0.3)] shadow-[0_1px_20px_rgba(224,64,251,0.1)]"
          : "bg-[#0D0D0F] border-b border-[rgba(224,64,251,0.15)]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E040FB] to-[#F50057]"
        >
          {content.site.name}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLink("/", "Resume")}

          {isAuth ? (
            <>
              {role === "admin" && navLink("/admin", "Admin")}
              {(role === "admin" || role === "recruiter") &&
                navLink("/recruiter", "Recruiter View")}

              <div className="flex items-center gap-3 pl-4 border-l border-[rgba(224,64,251,0.2)]">
                <div className="flex items-center gap-2 text-sm text-[#A0A0B8]">
                  <UserIcon size={16} />
                  <span>{name || "User"}</span>
                  <span className="text-xs bg-[rgba(224,64,251,0.1)] text-[#E040FB] border border-[rgba(224,64,251,0.3)] px-2 py-0.5 rounded-full">
                    {role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300 font-medium ml-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {navLink("/login", "Sign In")}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#A0A0B8] hover:text-[#E040FB] transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[rgba(224,64,251,0.15)] bg-[#13111A] px-6 py-4 space-y-4">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block text-sm font-medium transition-colors ${
              pathname === "/" ? "text-[#F50057]" : "text-[#A0A0B8]"
            }`}
          >
            Resume
          </Link>
          {isAuth ? (
            <>
              {role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm font-medium transition-colors ${
                    pathname === "/admin" ? "text-[#F50057]" : "text-[#A0A0B8]"
                  }`}
                >
                  Admin
                </Link>
              )}
              {(role === "admin" || role === "recruiter") && (
                <Link
                  href="/recruiter"
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm font-medium transition-colors ${
                    pathname === "/recruiter" ? "text-[#F50057]" : "text-[#A0A0B8]"
                  }`}
                >
                  Recruiter View
                </Link>
              )}
              <div className="pt-4 border-t border-[rgba(224,64,251,0.15)]">
                <div className="text-sm text-[#A0A0B8] mb-2">
                  Signed in as {name || role}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-sm text-red-400 font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium text-[#A0A0B8]"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
