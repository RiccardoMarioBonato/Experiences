"use client";

import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";

const projects = [
  {
    title: "Fruits Anomaly Detector",
    subtitle: "Cira-core · AI / Computer Vision",
    description:
      "An AI deep-trained to detect bruises and anomalies on fruits moving along a conveyor belt. Designed for farms and factories to maximise separation speed without manual labour.",
    date: "Feb 2022",
    tech: ["Python", "Deep Learning", "Computer Vision", "Cira-core"],
    embedId: "qsnYS9TW0rA",
    watchUrl: "https://www.youtube.com/watch?v=qsnYS9TW0rA",
    accent: "#E040FB",
  },
  {
    title: "Sleep Efficiency Prediction",
    subtitle: "Streamlit · Full-Stack Web App",
    description:
      "A full-stack web application and API that predicts sleep efficiency and surfaces users' sleep data. Combines sensor inputs like temperature, humidity, and heartbeat for real-time analysis.",
    date: "Apr 2025",
    tech: ["Python", "Streamlit", "REST API", "Data Science"],
    embedId: "h2TsERTA184",
    embedStart: 303,
    watchUrl: "https://www.youtube.com/watch?v=h2TsERTA184&t=303s",
    accent: "#F50057",
  },
  {
    title: "Tactical Hero Battle Game",
    subtitle: "Python · 2D Strategy Game",
    description:
      "A 2D side-scrolling tactical strategy game combining tower-defense mechanics inspired by Line Ranger and Battle Cats. Built from scratch in Python using OOP principles.",
    date: "May 2025",
    tech: ["Python", "Pygame", "OOP", "Game Design"],
    embedId: "_GoVpilOQjs",
    embedStart: 213,
    watchUrl: "https://www.youtube.com/watch?v=_GoVpilOQjs&t=213s",
    accent: "#E040FB",
  },
  {
    title: "UniPlus",
    subtitle: "Django · University Event Platform",
    description:
      "A comprehensive university event management platform built with Django and Next.js. Enables event discovery, registration, and provides organisers with QR-code attendance tracking.",
    date: "Dec 2025",
    tech: ["Django", "Next.js", "PostgreSQL", "QR Codes"],
    embedId: "Omv3rXfd7RY",
    watchUrl: "https://www.youtube.com/watch?v=Omv3rXfd7RY",
    accent: "#F50057",
  },
  {
    title: "Mole Diver",
    subtitle: "Kotlin · Mobile Game",
    description:
      "A mobile game developed as part of a university course project, built natively in Kotlin for Android. Features original game mechanics and full end-to-end mobile development.",
    date: "Apr 2026",
    tech: ["Kotlin", "Android", "Mobile", "Game Dev"],
    embedId: "YeRQQ-hIEOQ",
    embedStart: 281,
    watchUrl: "https://www.youtube.com/watch?v=YeRQQ-hIEOQ&t=281s",
    accent: "#E040FB",
  },
];

export default function VideosPage() {
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
        {projects.map((project, i) => (
          <div
            key={project.embedId}
            className={`flex flex-col ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } gap-8 items-start`}
          >
            {/* Embed */}
            <div className="w-full md:w-[58%] flex-shrink-0">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  aspectRatio: "16/9",
                  border: `1px solid rgba(${project.accent === "#E040FB" ? "224,64,251" : "245,0,87"}, 0.25)`,
                  boxShadow: `0 0 40px rgba(${project.accent === "#E040FB" ? "224,64,251" : "245,0,87"}, 0.08)`,
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${project.embedId}${
                    project.embedStart ? `?start=${project.embedStart}` : ""
                  }`}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center gap-3 md:w-[42%]">
              <span
                className="text-xs font-medium"
                style={{ color: project.accent }}
              >
                {project.date}
              </span>
              <h2 className="text-2xl font-bold text-white leading-snug">{project.title}</h2>
              <p
                className="text-sm font-medium"
                style={{ color: "rgba(160,160,184,0.7)" }}
              >
                {project.subtitle}
              </p>
              <p className="text-[#A0A0B8] text-sm leading-relaxed">{project.description}</p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mt-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs"
                    style={{
                      background: "rgba(224, 64, 251, 0.07)",
                      border: "1px solid rgba(224, 64, 251, 0.2)",
                      color: "#A0A0B8",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={project.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm mt-2 transition-colors"
                style={{ color: project.accent }}
              >
                Watch on YouTube <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
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
