"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ResumeSectionCard from "@/components/ResumeSection";
import CommentPanel from "@/components/CommentPanel";
import api from "@/lib/api";
import content from "@/content.json";
import { Download, Github, Linkedin, Mail, ChevronDown } from "lucide-react";

const { site, resume: copy } = content;

interface ResumeSection {
  id: number;
  section_type: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  order: number;
}

interface Comment {
  id: number;
  content: string;
  section_id: number;
  author: { id: number; full_name: string | null; email: string };
  created_at: string;
  updated_at: string;
}

const SECTION_ORDER = ["about", "experience", "education", "projects", "skills"];

export default function HomePage() {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<ResumeSection[]>("/resume/");
        setSections(res.data);

        const entries = await Promise.all(
          res.data.map(async (s) => {
            const c = await api.get<Comment[]>(`/comments/${s.id}`);
            return [s.id, c.data] as [number, Comment[]];
          })
        );
        setComments(Object.fromEntries(entries));
      } catch (err) {
        console.error("Failed to load resume", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const grouped = SECTION_ORDER.reduce<Record<string, ResumeSection[]>>((acc, type) => {
    const items = sections
      .filter((s) => s.section_type === type)
      .sort((a, b) => a.order - b.order);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white animate-fade-in overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] px-6 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full blur-3xl"
            style={{ background: "rgba(224, 64, 251, 0.07)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/3 w-[300px] h-[200px] rounded-full blur-3xl"
            style={{ background: "rgba(245, 0, 87, 0.05)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 py-20 md:min-h-[90vh]">

          {/* ── LEFT COLUMN — 55% ── */}
          <div className="w-full md:w-[55%] flex flex-col items-start text-left">

            {/* Role badge */}
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-pulse-glow"
              style={{
                background: "rgba(224, 64, 251, 0.1)",
                border: "1px solid rgba(224, 64, 251, 0.3)",
                color: "#E040FB",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E040FB] animate-pulse" />
              {copy.hero.role}
            </span>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-4 animate-slide-in-left">
              {copy.hero.greeting}{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #E040FB, #F50057)" }}
              >
                {copy.hero.name}
              </span>
            </h1>

            <p
              className="text-[#A0A0B8] text-lg max-w-xl leading-relaxed mb-6 animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              {copy.hero.bio}
            </p>

            {/* Vibe tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["Software Engineer", "Full-Stack Developer", "Bangkok, TH"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(224, 64, 251, 0.07)",
                    border: "1px solid rgba(224, 64, 251, 0.25)",
                    color: "#A0A0B8",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-4 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <button
                onClick={() => resumeRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary flex items-center gap-2"
              >
                {copy.hero.ctaButton}
                <ChevronDown size={16} />
              </button>

              <a
                href={`mailto:${site.email}`}
                className="btn-ghost flex items-center gap-2"
              >
                <Mail size={16} />
                {copy.contact.buttonText}
              </a>
            </div>

            {/* Social links */}
            <div
              className="flex items-center gap-6 mt-10 animate-fade-up"
              style={{ animationDelay: "450ms", color: "#A0A0B8" }}
            >
              {site.github && (
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="hover:text-[#E040FB] transition-colors duration-200"
                >
                  <Github size={20} />
                </a>
              )}
              {site.linkedin && (
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-[#E040FB] transition-colors duration-200"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN — 45% ── */}
          {false && (
          <div className="w-full md:w-[45%] flex justify-center md:justify-end">
            {/* Image container — fixed height, relative so badge & glows can anchor to it */}
            <div
              className="relative flex justify-center items-end"
              style={{ height: 520, width: "100%", maxWidth: 420 }}
            >
              {/* Primary purple glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-80 h-80 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(168, 85, 247, 0.25)" }}
              />
              {/* Secondary pink glow — offset down-right */}
              <div
                className="absolute top-[55%] left-[55%] w-48 h-48 rounded-full blur-2xl pointer-events-none"
                style={{ background: "rgba(245, 0, 87, 0.20)" }}
              />

              {/* Hero photo — transparent PNG, floats above glows */}
              <Image
                src="/hero.png"
                alt="Riccardo M. Bonato — professional headshot, white tee, arms crossed"
                width={400}
                height={520}
                priority
                className="relative z-10 w-auto object-contain md:max-h-[520px] max-h-[320px]"
                style={{ objectFit: "contain" }}
              />

              {/* "Open to work" badge — bottom-left of container */}
              <span
                className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(16, 185, 129, 0.10)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  color: "#4ade80",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Open to work
              </span>
            </div>
          </div>
          )}

        </div>
      </section>

      {/* ── PERSONALITY STRIP ────────────────────────────── */}
      {false && (
      <section className="max-w-4xl mx-auto px-6 py-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">

          {/* Card 1 — portrait.png (transparent) */}
          <div className="group relative flex flex-col items-center">
            <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: 288 }}>
              {/* Purple glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(168, 85, 247, 0.20)" }}
              />
              <Image
                src="/portrait.png"
                alt="Riccardo in a denim jacket — editorial portrait"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="text-sm text-slate-500 text-center mt-3">Builder</p>
          </div>

          {/* Card 2 — fun.png (transparent) */}
          <div className="group relative flex flex-col items-center">
            <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: 288 }}>
              {/* Pink glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(245, 0, 87, 0.20)" }}
              />
              <Image
                src="/fun.png"
                alt="Riccardo in a suit with aviator glasses on a film set"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="text-sm text-slate-500 text-center mt-3">Actor?</p>
          </div>

        </div>
      </section>
      )}

      {/* ── RESUME CONTENT ───────────────────────────────── */}
      <section ref={resumeRef} className="max-w-4xl mx-auto px-6 pb-24 pt-4">

        {/* PDF download strip */}
        <div
          className="flex items-center justify-between mb-10 pb-6"
          style={{ borderBottom: "1px solid rgba(224, 64, 251, 0.15)" }}
        >
          <div>
            <h2 className="text-xl font-bold text-white">Resume</h2>
            <p className="text-[#A0A0B8] text-sm mt-0.5">Live content — updated in real time</p>
          </div>
          <button
            onClick={() => window.print()}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <Download size={15} />
            {copy.hero.downloadButton}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-4 w-1/4 mb-3" />
                <div className="skeleton h-6 w-3/4 mb-2" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#A0A0B8] text-sm">No resume content available yet.</p>
            <Link
              href="/login"
              className="text-[#E040FB] text-sm mt-2 inline-block hover:underline"
            >
              Sign in as Admin to add content →
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                {/* Section type heading */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1" style={{ background: "rgba(224, 64, 251, 0.15)" }} />
                  <span className="section-chip">{type}</span>
                  <div className="h-px flex-1" style={{ background: "rgba(224, 64, 251, 0.15)" }} />
                </div>

                <div className="space-y-4">
                  {items.map((section, i) => (
                    <ResumeSectionCard key={section.id} section={section} index={i}>
                      <CommentPanel
                        sectionId={section.id}
                        initialComments={comments[section.id] ?? []}
                      />
                    </ResumeSectionCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer
        className="py-8 text-sm"
        style={{
          borderTop: "1px solid rgba(224, 64, 251, 0.15)",
          color: "rgba(160, 160, 184, 0.5)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left — logo + brand */}
          {/* <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.jpg" alt="RickFolio logo" width={24} height={24} />
            <span className="text-slate-400 font-medium">RickFolio</span>
          </Link> */}

          {/* Center */}
          <p className="text-slate-600">Built by <span className="text-slate-400">{site.owner}</span></p>

          {/* Right — social links */}
          <div className="flex items-center gap-4 text-slate-500">
            {site.github && (
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-[#E040FB] transition-colors duration-200"
              >
                <Github size={18} />
              </a>
            )}
            {site.linkedin && (
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#E040FB] transition-colors duration-200"
              >
                <Linkedin size={18} />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
