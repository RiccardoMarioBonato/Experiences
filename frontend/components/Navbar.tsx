"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getRole, getName, clearAuth } from "@/lib/auth";
import { Menu, X, User as UserIcon } from "lucide-react";
import content from "@/content.json";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const isAuth = mounted && isAuthenticated();
  const role = mounted ? getRole() : null;
  const name = mounted ? getName() : null;

  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          {content.site.name}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Resume
          </Link>

          {isAuth ? (
            <>
              {role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Admin
                </Link>
              )}
              {(role === "admin" || role === "recruiter") && (
                <Link href="/recruiter" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Recruiter View
                </Link>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <UserIcon size={16} />
                  <span>{name || "User"}</span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{role}</span>
                </div>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 font-medium ml-2">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-400">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-6 py-4 space-y-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-gray-300">
            Resume
          </Link>
          {isAuth ? (
            <>
              {role === "admin" && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-gray-300">
                  Admin
                </Link>
              )}
              {(role === "admin" || role === "recruiter") && (
                <Link href="/recruiter" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-gray-300">
                  Recruiter View
                </Link>
              )}
              <div className="pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Signed in as {name || role}</div>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-sm text-red-400 font-medium">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-gray-300">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
