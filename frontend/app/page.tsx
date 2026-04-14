"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ResumeSectionCard from "@/components/ResumeSection";
import CommentPanel from "@/components/CommentPanel";
import api from "@/lib/api";
import content from "@/content.json";
import { Download, Github, Linkedin, Mail, ChevronDown } from "lucide-react";
import ContactModal from "@/components/ContactModal";

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
  has_video: boolean;
  youtube_url: string | null;
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
  const [grouped, setGrouped] = useState<Record<string, ResumeSection[]>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Record<string, ResumeSection[]>>("/resume/");
        setGrouped(res.data);

        const allSections = Object.values(res.data).flat();
        const entries = await Promise.all(
          allSections.map(async (s) => {
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

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] px-6 overflow-hidden animate-fade-in">
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

              <button
                onClick={() => setIsContactOpen(true)}
                className="btn-ghost flex items-center gap-2"
              >
                <Mail size={16} />
                {copy.contact.buttonText}
              </button>
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
          <div className="w-full md:w-[45%] flex justify-center md:justify-end">
            <style>{`
              @media (prefers-reduced-motion: no-preference) {
                @keyframes cb-logo-pulse {
                  0%,100% { box-shadow: 0 0 40px rgba(224,64,251,.5), 0 0 80px rgba(224,64,251,.2); }
                  50%     { box-shadow: 0 0 62px rgba(224,64,251,.78), 0 0 110px rgba(224,64,251,.35), 0 0 0 2px rgba(224,64,251,.25); }
                }
                @keyframes cb-ring-rot {
                  from { transform: translate(-50%,-50%) rotate(0deg);   }
                  to   { transform: translate(-50%,-50%) rotate(360deg); }
                }
                @keyframes cb-da {
                  0%,100% { opacity:.45; box-shadow:0 0 6px 2px rgba(224,64,251,.6); }
                  50%     { opacity:1;   box-shadow:0 0 10px 4px rgba(224,64,251,.9); }
                }
                @keyframes cb-db {
                  0%,100% { opacity:.45; box-shadow:0 0 6px 2px rgba(245,0,87,.6); }
                  50%     { opacity:1;   box-shadow:0 0 10px 4px rgba(245,0,87,.9); }
                }
                @keyframes cb-pr { 0%{opacity:0;transform:translateX(0)}  20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:translateX(80px)}  }
                @keyframes cb-pl { 0%{opacity:0;transform:translateX(0)}  20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:translateX(-70px)} }
                @keyframes cb-pu { 0%{opacity:0;transform:translateY(0)}  20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:translateY(-72px)} }
                @keyframes cb-pd { 0%{opacity:0;transform:translateY(0)}  20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:translateY(72px)}  }
                .cb-logo { animation: cb-logo-pulse 3s ease-in-out infinite; }
                .cb-ring { animation: cb-ring-rot 30s linear infinite; }
                .cb-da   { animation: cb-da 2s ease-in-out infinite; }
                .cb-db   { animation: cb-db 2s ease-in-out infinite; }
                .cb-p0   { animation: cb-pr 2.4s ease-in-out infinite 0s;   }
                .cb-p1   { animation: cb-pr 2.4s ease-in-out infinite .4s;  }
                .cb-p2   { animation: cb-pu 2.4s ease-in-out infinite .8s;  }
                .cb-p3   { animation: cb-pl 2.4s ease-in-out infinite 1.2s; }
                .cb-p4   { animation: cb-pl 2.4s ease-in-out infinite 1.6s; }
                .cb-p5   { animation: cb-pl 2.4s ease-in-out infinite 2.0s; }
                .cb-p6   { animation: cb-pd 2.4s ease-in-out infinite 2.4s; }
                .cb-p7   { animation: cb-pr 2.4s ease-in-out infinite 2.8s; }
              }
              @media (max-width: 640px) {
                .cb-stage { transform: scale(0.67); transform-origin: center top; }
              }
            `}</style>

            {/* 420×420 stage — all traces use absolute pixel coords */}
            {/* Logo is 220×220 centered → edges at x:100,320  y:100,320  */}
            <div className="cb-stage" style={{ position:"relative", width:420, height:420, flexShrink:0 }}>

              {/* ── Corner accent dots ── */}
              <div className="cb-da" style={{position:"absolute",top:12,left:12,width:8,height:8,borderRadius:"50%",background:"#E040FB"}} />
              <div className="cb-db" style={{position:"absolute",top:12,right:12,width:8,height:8,borderRadius:"50%",background:"#F50057",animationDelay:".5s"}} />
              <div className="cb-db" style={{position:"absolute",bottom:12,left:12,width:8,height:8,borderRadius:"50%",background:"#F50057",animationDelay:"1s"}} />
              <div className="cb-da" style={{position:"absolute",bottom:12,right:12,width:8,height:8,borderRadius:"50%",background:"#E040FB",animationDelay:"1.5s"}} />

              {/* ── Outer rotating ring with 4 tick marks ── */}
              <div className="cb-ring" style={{
                position:"absolute",top:"50%",left:"50%",
                width:388,height:388,marginLeft:-194,marginTop:-194,
                borderRadius:"50%",border:"1px solid rgba(224,64,251,.2)",
              }}>
                {/* N tick */}
                <div style={{position:"absolute",top:0,left:"50%",width:8,height:3,background:"rgba(224,64,251,.7)",transform:"translate(-50%,-1px)"}} />
                {/* S tick */}
                <div style={{position:"absolute",bottom:0,left:"50%",width:8,height:3,background:"rgba(224,64,251,.7)",transform:"translate(-50%,1px)"}} />
                {/* W tick */}
                <div style={{position:"absolute",top:"50%",left:0,width:3,height:8,background:"rgba(224,64,251,.7)",transform:"translate(-1px,-50%)"}} />
                {/* E tick */}
                <div style={{position:"absolute",top:"50%",right:0,width:3,height:8,background:"rgba(224,64,251,.7)",transform:"translate(1px,-50%)"}} />
              </div>

              {/* ── T1: Right  x 320→408, y 210 ── */}
              <div style={{position:"absolute",top:209,left:320,width:88,height:2,background:"rgba(224,64,251,.3)"}}>
                {/* mid node */}
                <div style={{position:"absolute",left:32,top:-1,width:4,height:4,background:"rgba(224,64,251,.8)"}} />
                {/* end node */}
                <div style={{position:"absolute",right:-3,top:-2,width:6,height:6,background:"#E040FB",boxShadow:"0 0 6px 3px rgba(224,64,251,.8)"}} />
                {/* pulse — starts at logo side (left:0), travels right */}
                <div className="cb-p0" style={{position:"absolute",top:-2,left:0,width:6,height:6,borderRadius:"50%",background:"#fff",boxShadow:"0 0 6px 2px rgba(255,255,255,.9)"}} />
              </div>

              {/* ── T2: Top-right — H seg then V seg ── */}
              {/* H: x 320→388, y 144 */}
              <div style={{position:"absolute",top:144,left:320,width:68,height:2,background:"rgba(245,0,87,.3)"}}>
                <div className="cb-p1" style={{position:"absolute",top:-2,left:0,width:6,height:6,borderRadius:"50%",background:"#F50057",boxShadow:"0 0 6px 2px rgba(245,0,87,.9)"}} />
              </div>
              {/* V: x 386, y 55→145 */}
              <div style={{position:"absolute",top:55,left:385,width:2,height:90,background:"rgba(245,0,87,.3)"}}>
                <div style={{position:"absolute",top:-3,left:-2,width:6,height:6,background:"#F50057",boxShadow:"0 0 6px 3px rgba(245,0,87,.8)"}} />
              </div>
              {/* corner node */}
              <div style={{position:"absolute",top:141,left:383,width:5,height:5,background:"rgba(245,0,87,.9)",boxShadow:"0 0 4px rgba(245,0,87,.6)"}} />

              {/* ── T3: Top  x 210, y 20→100 ── */}
              <div style={{position:"absolute",top:20,left:209,width:2,height:80,background:"rgba(224,64,251,.3)"}}>
                <div style={{position:"absolute",top:24,left:-1,width:4,height:4,background:"rgba(224,64,251,.8)"}} />
                <div style={{position:"absolute",top:-3,left:-2,width:6,height:6,background:"#E040FB",boxShadow:"0 0 6px 3px rgba(224,64,251,.8)"}} />
                {/* pulse — starts at logo side (bottom), travels up */}
                <div className="cb-p2" style={{position:"absolute",bottom:0,left:-2,width:6,height:6,borderRadius:"50%",background:"#fff",boxShadow:"0 0 6px 2px rgba(255,255,255,.9)"}} />
              </div>

              {/* ── T4: Top-left — H seg then V seg ── */}
              {/* H: x 35→100, y 144 */}
              <div style={{position:"absolute",top:144,left:35,width:65,height:2,background:"rgba(245,0,87,.3)"}}>
                {/* pulse — starts at logo side (right), travels left */}
                <div className="cb-p3" style={{position:"absolute",top:-2,right:0,width:6,height:6,borderRadius:"50%",background:"#E040FB",boxShadow:"0 0 6px 2px rgba(224,64,251,.9)"}} />
              </div>
              {/* V: x 35, y 55→145 */}
              <div style={{position:"absolute",top:55,left:34,width:2,height:90,background:"rgba(245,0,87,.3)"}}>
                <div style={{position:"absolute",top:-3,left:-2,width:6,height:6,background:"#F50057",boxShadow:"0 0 6px 3px rgba(245,0,87,.8)"}} />
              </div>
              {/* corner node */}
              <div style={{position:"absolute",top:141,left:32,width:5,height:5,background:"rgba(245,0,87,.9)",boxShadow:"0 0 4px rgba(245,0,87,.6)"}} />

              {/* ── T5: Left  x 20→100, y 210 ── */}
              <div style={{position:"absolute",top:209,left:20,width:80,height:2,background:"rgba(224,64,251,.3)"}}>
                <div style={{position:"absolute",left:28,top:-1,width:4,height:4,background:"rgba(224,64,251,.8)"}} />
                <div style={{position:"absolute",left:-3,top:-2,width:6,height:6,background:"#E040FB",boxShadow:"0 0 6px 3px rgba(224,64,251,.8)"}} />
                {/* pulse — starts at logo side (right), travels left */}
                <div className="cb-p4" style={{position:"absolute",top:-2,right:0,width:6,height:6,borderRadius:"50%",background:"#fff",boxShadow:"0 0 6px 2px rgba(255,255,255,.9)"}} />
              </div>

              {/* ── T6: Bottom-left — H seg then V seg ── */}
              {/* H: x 35→100, y 275 */}
              <div style={{position:"absolute",top:274,left:35,width:65,height:2,background:"rgba(245,0,87,.3)"}}>
                {/* pulse — starts at logo side (right), travels left */}
                <div className="cb-p5" style={{position:"absolute",top:-2,right:0,width:6,height:6,borderRadius:"50%",background:"#F50057",boxShadow:"0 0 6px 2px rgba(245,0,87,.9)"}} />
              </div>
              {/* V: x 35, y 275→375 */}
              <div style={{position:"absolute",top:275,left:34,width:2,height:100,background:"rgba(245,0,87,.3)"}}>
                <div style={{position:"absolute",bottom:-3,left:-2,width:6,height:6,background:"#F50057",boxShadow:"0 0 6px 3px rgba(245,0,87,.8)"}} />
              </div>
              {/* corner node */}
              <div style={{position:"absolute",top:271,left:32,width:5,height:5,background:"rgba(245,0,87,.9)",boxShadow:"0 0 4px rgba(245,0,87,.6)"}} />

              {/* ── T7: Bottom  x 210, y 320→400 ── */}
              <div style={{position:"absolute",top:320,left:209,width:2,height:80,background:"rgba(224,64,251,.3)"}}>
                <div style={{position:"absolute",top:28,left:-1,width:4,height:4,background:"rgba(224,64,251,.8)"}} />
                <div style={{position:"absolute",bottom:-3,left:-2,width:6,height:6,background:"#E040FB",boxShadow:"0 0 6px 3px rgba(224,64,251,.8)"}} />
                {/* pulse — starts at logo side (top), travels down */}
                <div className="cb-p6" style={{position:"absolute",top:0,left:-2,width:6,height:6,borderRadius:"50%",background:"#fff",boxShadow:"0 0 6px 2px rgba(255,255,255,.9)"}} />
              </div>

              {/* ── T8: Bottom-right — H seg then V seg ── */}
              {/* H: x 320→388, y 275 */}
              <div style={{position:"absolute",top:274,left:320,width:68,height:2,background:"rgba(224,64,251,.3)"}}>
                {/* pulse — starts at logo side (left:0), travels right */}
                <div className="cb-p7" style={{position:"absolute",top:-2,left:0,width:6,height:6,borderRadius:"50%",background:"#E040FB",boxShadow:"0 0 6px 2px rgba(224,64,251,.9)"}} />
              </div>
              {/* V: x 386, y 275→375 */}
              <div style={{position:"absolute",top:275,left:385,width:2,height:100,background:"rgba(224,64,251,.3)"}}>
                <div style={{position:"absolute",bottom:-3,left:-2,width:6,height:6,background:"#E040FB",boxShadow:"0 0 6px 3px rgba(224,64,251,.8)"}} />
              </div>
              {/* corner node */}
              <div style={{position:"absolute",top:271,left:383,width:5,height:5,background:"rgba(224,64,251,.9)",boxShadow:"0 0 4px rgba(224,64,251,.6)"}} />

              {/* ── Ambient glow behind logo ── */}
              <div style={{
                position:"absolute",top:"50%",left:"50%",
                width:290,height:290,borderRadius:"50%",
                background:"radial-gradient(circle, rgba(224,64,251,.18) 0%, rgba(245,0,87,.08) 55%, transparent 72%)",
                transform:"translate(-50%,-50%)",
                pointerEvents:"none",zIndex:1,
              }} />

              {/* ── Logo ── */}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:10}}>
                <Image
                  src="/photos/R_logo_bng.png"
                  alt="RickFolio logo"
                  width={220}
                  height={220}
                  priority
                  className="cb-logo"
                  style={{borderRadius:"50%",width:220,height:220,objectFit:"cover",display:"block"}}
                />
              </div>

            </div>
          </div>

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
          <a
            href="/photos/Riccardo_Resume.pdf"
            download="Riccardo_Resume.pdf"
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <Download size={15} />
            {copy.hero.downloadButton}
          </a>
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
        ) : Object.keys(grouped).length === 0 ? (
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
            {SECTION_ORDER.filter((type) => grouped[type]?.length > 0).map((type) => (
              <div key={type}>
                {/* Section type heading */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1" style={{ background: "rgba(224, 64, 251, 0.15)" }} />
                  <span className="section-chip">{type}</span>
                  <div className="h-px flex-1" style={{ background: "rgba(224, 64, 251, 0.15)" }} />
                </div>

                <div className="space-y-4">
                  {grouped[type].map((section, i) => (
                    <ResumeSectionCard
                      key={section.id}
                      section={section}
                      index={i}
                      videoLink={
                        section.section_type === "projects" && section.has_video
                          ? "/videos"
                          : undefined
                      }
                    >
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

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

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
