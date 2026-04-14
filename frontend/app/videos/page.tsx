"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Play, Clock } from "lucide-react";
import api from "@/lib/api";

interface ResumeSection {
  id: number;
  section_type: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  order: number;
  has_video: boolean;
  youtube_url: string | null;
}

const ACCENTS = ["#E040FB", "#F50057"] as const;

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideosPage() {
  const [projects, setProjects] = useState<ResumeSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Record<string, ResumeSection[]>>("/resume/")
      .then((res) => {
        const all = Object.values(res.data).flat();
        setProjects(all.filter((s) => s.section_type === "projects" && s.has_video));
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white overflow-x-hidden">

      {/* ── HEADER ─────────────────────────────────────── */}
      <section className="relative px-6 pt-16 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/3 w-[500px] h-[250px] rounded-full blur-3xl"
            style={{ background: "rgba(224, 64, 251, 0.07)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[300px] h-[150px] rounded-full blur-3xl"
            style={{ background: "rgba(245, 0, 87, 0.05)" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{
              background: "rgba(224, 64, 251, 0.1)",
              border: "1px solid rgba(224, 64, 251, 0.3)",
              color: "#E040FB",
            }}
          >
            <Play size={13} fill="#E040FB" /> Project Demos
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Work in{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #E040FB, #F50057)" }}
            >
              Motion
            </span>
          </h1>
          <p className="text-[#A0A0B8] text-lg max-w-xl">
            Video demos of my projects — from AI tools to games and full-stack platforms.
          </p>
        </div>
      </section>

      {/* ── VIDEO GRID ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        {loading ? (
          <div className="space-y-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-[58%] skeleton rounded-2xl" style={{ aspectRatio: "16/9" }} />
                <div className="flex flex-col gap-3 md:w-[42%] w-full">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-7 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#A0A0B8] text-sm">No video demos yet.</p>
          </div>
        ) : (
          projects.map((project, i) => {
            const accent = ACCENTS[i % 2];
            const accentRgb = accent === "#E040FB" ? "224,64,251" : "245,0,87";
            const videoId = project.youtube_url ? extractYouTubeId(project.youtube_url) : null;
            const date = project.end_date ?? project.start_date;

            return (
              <div
                key={project.id}
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-start`}
              >
                {/* Embed or placeholder */}
                <div className="w-full md:w-[58%] flex-shrink-0">
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      aspectRatio: "16/9",
                      border: `1px solid rgba(${accentRgb}, 0.25)`,
                      boxShadow: `0 0 40px rgba(${accentRgb}, 0.08)`,
                    }}
                  >
                    {videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={project.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                        style={{ background: "rgba(19,17,26,0.8)" }}
                      >
                        <Clock size={32} style={{ color: `rgba(${accentRgb}, 0.5)` }} />
                        <p className="text-sm font-medium" style={{ color: `rgba(${accentRgb}, 0.7)` }}>
                          Video coming soon
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center gap-3 md:w-[42%]">
                  {date && (
                    <span className="text-xs font-medium" style={{ color: accent }}>
                      {date}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-white leading-snug">{project.title}</h2>
                  {project.subtitle && (
                    <p className="text-sm font-medium" style={{ color: "rgba(160,160,184,0.7)" }}>
                      {project.subtitle}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-[#A0A0B8] text-sm leading-relaxed">{project.description}</p>
                  )}
                  {project.youtube_url && (
                    <a
                      href={project.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm mt-2 transition-colors"
                      style={{ color: accent }}
                    >
                      Watch on YouTube <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────── */}
      <div
        className="max-w-5xl mx-auto px-6 pb-16 flex items-center justify-center gap-6 flex-wrap"
        style={{ borderTop: "1px solid rgba(224, 64, 251, 0.15)", paddingTop: "3rem" }}
      >
        <Link href="/" className="btn-ghost">← Back to Resume</Link>
        <Link href="/about" className="btn-primary flex items-center gap-2">About Me</Link>
      </div>

    </div>
  );
}
