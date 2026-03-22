"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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

        // Fetch comments for all sections in parallel
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

  // Group sections by type, ordered by SECTION_ORDER
  const grouped = SECTION_ORDER.reduce<Record<string, ResumeSection[]>>((acc, type) => {
    const items = sections
      .filter((s) => s.section_type === type)
      .sort((a, b) => a.order - b.order);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* Role badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {copy.hero.role}
        </span>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-4">
          {copy.hero.greeting}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            {copy.hero.name}
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-10">
          {copy.hero.bio}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
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
        <div className="flex items-center gap-6 mt-10 text-slate-500">
          {site.github && (
            <a href={site.github} target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors">
              <Github size={20} />
            </a>
          )}
          {site.linkedin && (
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors">
              <Linkedin size={20} />
            </a>
          )}
        </div>
      </section>

      {/* ── RESUME CONTENT ───────────────────────────────── */}
      <section ref={resumeRef} className="max-w-4xl mx-auto px-6 pb-24 pt-4">

        {/* PDF download strip */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Resume</h2>
            <p className="text-slate-500 text-sm mt-0.5">Live content — updated in real time</p>
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
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-1/4 mb-3" />
                <div className="h-6 bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-500 text-sm">No resume content available yet.</p>
            <Link href="/login" className="text-indigo-400 text-sm mt-2 inline-block hover:underline">
              Sign in as Admin to add content →
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                {/* Section type heading */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="section-chip">{type}</span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="space-y-4">
                  {items.map((section) => (
                    <ResumeSectionCard key={section.id} section={section}>
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
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        <p>
          Built by <span className="text-slate-400">{site.owner}</span> ·{" "}
          <Link href="/login" className="hover:text-slate-400 transition-colors">
            Admin login
          </Link>
        </p>
      </footer>
    </div>
  );
}
