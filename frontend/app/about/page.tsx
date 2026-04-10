"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Calendar, Code2, Briefcase, Video } from "lucide-react";
import content from "@/content.json";

const { site } = content;

const skillGroups = [
  {
    label: "Programming",
    skills: ["JavaScript", "TypeScript", "Python", "C++", "C#", "Go", "Kotlin", "React"],
  },
  {
    label: "Backend / DevOps",
    skills: ["PostgreSQL", "REST API Design", "Django", "SQLite", "MySQL", "Docker"],
  },
  {
    label: "Work Tools",
    skills: ["GitHub", "Photoshop", "Jira", "Vegas Pro", "Clip Studio", "Blender", "Aseprite"],
  },
  {
    label: "Game Engines",
    skills: ["Godot", "Pygame", "Unreal Engine", "Unity"],
  },
];

const timeline = [
  {
    year: "Jun 2023 – Present",
    title: "IT / Tech Support",
    place: "Guru Electronics · Bangkok, Thailand",
    description:
      "Software & hardware support, customer sales assistance, and initial web development setup for clients. Media editing with Vegas Pro, Photoshop, and Blender. Trilingual: Thai (Native), English (Master), Italian (Native).",
  },
  {
    year: "Oct 2021 – Oct 2027",
    title: "Bachelor's in Software and Knowledge Engineering",
    place: "Kasetsart University · Bangkok, Thailand",
    description:
      "Studying software engineering with a focus on full-stack development, game development, and applied AI. Expected graduation Oct 2027.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-12 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full blur-3xl"
            style={{ background: "rgba(224, 64, 251, 0.07)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full blur-3xl"
            style={{ background: "rgba(245, 0, 87, 0.05)" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-2xl blur-2xl scale-110 opacity-40"
              style={{ background: "linear-gradient(135deg, #E040FB, #F50057)" }}
            />
            <Image
              src="/photos/portrait.png"
              alt="Riccardo M. Bonato — portrait"
              width={280}
              height={360}
              priority
              className="relative rounded-2xl object-cover z-10"
              style={{ objectFit: "cover", height: 360, width: 280 }}
            />
          </div>

          {/* Intro text */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
              style={{
                background: "rgba(224, 64, 251, 0.1)",
                border: "1px solid rgba(224, 64, 251, 0.3)",
                color: "#E040FB",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E040FB] animate-pulse" />
              About Me
            </span>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Hey, I&apos;m{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #E040FB, #F50057)" }}
              >
                Riccardo
              </span>
            </h1>

            <p className="text-[#A0A0B8] text-lg leading-relaxed mb-4">
              I&apos;m a full-stack developer who loves turning complex problems into clean,
              intuitive products. I care as much about the code quality under the hood as I
              do about the experience on screen.
            </p>
            <p className="text-[#A0A0B8] text-lg leading-relaxed mb-6">
              When I&apos;m not building things, you&apos;ll find me exploring new tech, hitting the gym,
              or getting lost in a good film. I thrive in collaborative environments and enjoy
              working across the full stack — from database schema design to polished UIs.
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{
                  background: "rgba(224, 64, 251, 0.07)",
                  border: "1px solid rgba(224, 64, 251, 0.2)",
                  color: "#A0A0B8",
                }}
              >
                <MapPin size={13} /> Bangkok, TH
              </span>
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{
                  background: "rgba(224, 64, 251, 0.07)",
                  border: "1px solid rgba(224, 64, 251, 0.2)",
                  color: "#A0A0B8",
                }}
              >
                <Briefcase size={13} /> Open to Work
              </span>
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{
                  background: "rgba(224, 64, 251, 0.07)",
                  border: "1px solid rgba(224, 64, 251, 0.2)",
                  color: "#A0A0B8",
                }}
              >
                <Code2 size={13} /> Full-Stack Developer
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              {site.github && (
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex items-center gap-2 text-sm text-[#A0A0B8] hover:text-[#E040FB] transition-colors"
                >
                  <Github size={18} /> GitHub
                </a>
              )}
              {site.linkedin && (
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center gap-2 text-sm text-[#A0A0B8] hover:text-[#E040FB] transition-colors"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
              )}
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-sm text-[#A0A0B8] hover:text-[#E040FB] transition-colors"
              >
                <Mail size={18} /> Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div
          className="flex items-center gap-3 mb-6"
          style={{ borderBottom: "1px solid rgba(224, 64, 251, 0.15)", paddingBottom: "1.25rem" }}
        >
          <span className="section-chip">life in photos</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Hero photo */}
          <div className="group relative col-span-1 md:col-span-1 overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-xl"
              style={{ background: "rgba(224, 64, 251, 0.15)" }}
            />
            <Image
              src="/photos/hero.png"
              alt="Riccardo — professional look"
              width={400}
              height={480}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
              style={{ objectFit: "cover" }}
            />
            <span className="absolute bottom-3 left-3 z-20 text-xs text-[#A0A0B8] bg-[#0D0D0F]/70 px-2 py-1 rounded-md">
              Professional
            </span>
          </div>

          {/* Fun photo */}
          <div className="group relative overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-xl"
              style={{ background: "rgba(245, 0, 87, 0.15)" }}
            />
            <Image
              src="/photos/fun.png"
              alt="Riccardo — candid / fun shot"
              width={400}
              height={480}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
              style={{ objectFit: "cover" }}
            />
            <span className="absolute bottom-3 left-3 z-20 text-xs text-[#A0A0B8] bg-[#0D0D0F]/70 px-2 py-1 rounded-md">
              Off the clock
            </span>
          </div>

          {/* Event photo */}
          <div className="group relative overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-xl"
              style={{ background: "rgba(224, 64, 251, 0.15)" }}
            />
            <Image
              src="/photos/event.jpg"
              alt="Riccardo — at an event"
              width={400}
              height={480}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
              style={{ objectFit: "cover" }}
            />
            <span className="absolute bottom-3 left-3 z-20 text-xs text-[#A0A0B8] bg-[#0D0D0F]/70 px-2 py-1 rounded-md">
              Event
            </span>
          </div>
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div
          className="flex items-center gap-3 mb-6"
          style={{ borderBottom: "1px solid rgba(224, 64, 251, 0.15)", paddingBottom: "1.25rem" }}
        >
          <span className="section-chip">skills &amp; tools</span>
        </div>

        <div className="space-y-5">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#E040FB" }}>
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-default"
                    style={{
                      background: "rgba(224, 64, 251, 0.07)",
                      border: "1px solid rgba(224, 64, 251, 0.25)",
                      color: "#A0A0B8",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div
          className="flex items-center gap-3 mb-8"
          style={{ borderBottom: "1px solid rgba(224, 64, 251, 0.15)", paddingBottom: "1.25rem" }}
        >
          <span className="section-chip">journey</span>
        </div>

        <div className="relative pl-6 border-l" style={{ borderColor: "rgba(224, 64, 251, 0.2)" }}>
          {timeline.map((item, i) => (
            <div key={i} className="mb-10 last:mb-0 relative">
              {/* dot */}
              <div
                className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full border-2"
                style={{ background: "#0D0D0F", borderColor: "#E040FB" }}
              />
              <div
                className="flex items-center gap-2 text-xs font-medium mb-1"
                style={{ color: "#E040FB" }}
              >
                <Calendar size={12} />
                {item.year}
              </div>
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-sm mb-1" style={{ color: "#A0A0B8" }}>{item.place}</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(160,160,184,0.8)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-3">Want to work together?</h2>
        <p className="text-[#A0A0B8] mb-8 max-w-lg mx-auto">
          I&apos;m currently open to new opportunities — full-time, contract, or freelance.
          Drop me a line and let&apos;s build something great.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href={`mailto:${site.email}`} className="btn-primary flex items-center gap-2">
            <Mail size={16} /> Get in Touch
          </a>
          <Link href="/videos" className="btn-ghost flex items-center gap-2">
            <Video size={15} /> Watch My Work
          </Link>
          <Link href="/" className="btn-ghost">
            View Resume →
          </Link>
        </div>
      </section>

    </div>
  );
}
