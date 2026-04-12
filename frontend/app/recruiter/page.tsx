"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole, getName } from "@/lib/auth";
import api from "@/lib/api";
import content from "@/content.json";

const { recruiter: t } = content;

// ─── Types ───────────────────────────────────────────────
interface ResumeSection {
  id: number;
  section_type: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}
interface Comment {
  id: number;
  content: string;
  section_id: number;
  author: { id: number; full_name: string | null; email: string };
  created_at: string;
}

const textareaCls =
  "flex-1 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#A0A0B8] resize-none focus:outline-none transition-all";
const textareaStyle = {
  background: "#13111A",
  border: "1px solid rgba(224, 64, 251, 0.2)",
};

export default function RecruiterPage() {
  const router = useRouter();
  const [sections,     setSections]     = useState<ResumeSection[]>([]);
  const [comments,     setComments]     = useState<Record<number, Comment[]>>({});
  const [newComment,   setNewComment]   = useState<Record<number, string>>({});
  const [editingId,    setEditingId]    = useState<number | null>(null);
  const [editBody,     setEditBody]     = useState("");
  const [loading,      setLoading]      = useState(true);
  const [activeSec,    setActiveSec]    = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated() || (getRole() !== "recruiter" && getRole() !== "admin")) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Record<string, ResumeSection[]>>("/resume/");
        const allSections = Object.values(res.data).flat();
        setSections(allSections);

        const commentMap: Record<number, Comment[]> = {};
        await Promise.all(
          allSections.map(async (s: ResumeSection) => {
            const c = await api.get(`/comments/${s.id}`);
            commentMap[s.id] = c.data;
          })
        );
        setComments(commentMap);
      } catch (err) {
        console.error("Failed to load recruiter data", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePost = async (sectionId: number) => {
    const body = newComment[sectionId]?.trim();
    if (!body) return;
    try {
      const res = await api.post(`/comments/${sectionId}`, { content: body });
      setComments((c) => ({ ...c, [sectionId]: [...(c[sectionId] || []), res.data] }));
      setNewComment((n) => ({ ...n, [sectionId]: "" }));
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (commentId: number, sectionId: number) => {
    try {
      const res = await api.put(`/comments/${commentId}`, { content: editBody });
      setComments((c) => ({
        ...c,
        [sectionId]: c[sectionId].map((x) => (x.id === commentId ? res.data : x)),
      }));
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (commentId: number, sectionId: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((c) => ({
        ...c,
        [sectionId]: c[sectionId].filter((x) => x.id !== commentId),
      }));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
      <p className="text-[#A0A0B8] text-sm">Loading portfolio...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white animate-fade-in">
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black">{t.heading}</h1>
          <p className="text-[#A0A0B8] mt-1 text-sm">
            Signed in as{" "}
            <span className="text-[#E040FB] font-medium">{getName()}</span>{" "}
            · {t.subheading}
          </p>
        </div>

        {/* Resume sections */}
        {sections.length === 0 ? (
          <p className="text-[#A0A0B8] text-sm text-center py-16">
            No resume content available yet.
          </p>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: "#13111A",
                  border: "1px solid rgba(224, 64, 251, 0.15)",
                }}
              >
                {/* Section header toggle */}
                <button
                  onClick={() =>
                    setActiveSec(activeSec === section.id ? null : section.id)
                  }
                  className="w-full flex items-center justify-between px-6 py-5 transition-colors"
                  style={
                    activeSec === section.id
                      ? { background: "rgba(224, 64, 251, 0.05)" }
                      : {}
                  }
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "rgba(224, 64, 251, 0.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      activeSec === section.id
                        ? "rgba(224, 64, 251, 0.05)"
                        : "")
                  }
                >
                  <div className="text-left">
                    <span className="section-chip">{section.section_type}</span>
                    <h2 className="text-lg font-bold text-white mt-1">{section.title}</h2>
                    {section.subtitle && (
                      <p className="text-[#E040FB] text-sm">{section.subtitle}</p>
                    )}
                    {(section.start_date || section.end_date) && (
                      <p className="text-[#A0A0B8] text-xs mt-0.5">
                        {section.start_date}
                        {section.start_date && section.end_date && " — "}
                        {section.end_date}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#A0A0B8]">
                      {comments[section.id]?.length || 0} comment
                      {comments[section.id]?.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[#A0A0B8] text-sm">
                      {activeSec === section.id ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {/* Expanded content */}
                {activeSec === section.id && (
                  <div
                    className="px-6 pb-6"
                    style={{ borderTop: "1px solid rgba(224, 64, 251, 0.15)" }}
                  >
                    {section.description && (
                      <div className="py-5">
                        <p className="text-[#A0A0B8] text-sm leading-relaxed whitespace-pre-wrap">
                          {section.description}
                        </p>
                      </div>
                    )}

                    <div
                      className={section.description ? "pt-5" : "pt-5"}
                      style={
                        section.description
                          ? { borderTop: "1px solid rgba(224, 64, 251, 0.15)" }
                          : {}
                      }
                    >
                      <h3 className="text-sm font-semibold text-[#A0A0B8] mb-4">Comments</h3>

                      {!comments[section.id] || comments[section.id].length === 0 ? (
                        <p className="text-sm mb-4" style={{ color: "rgba(160,160,184,0.4)" }}>
                          {t.emptyComments}
                        </p>
                      ) : (
                        <div className="space-y-3 mb-5">
                          {comments[section.id].map((c) => (
                            <div
                              key={c.id}
                              className="rounded-xl px-4 py-3"
                              style={{
                                background: "rgba(224, 64, 251, 0.06)",
                                border: "1px solid rgba(224, 64, 251, 0.12)",
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <span className="text-xs font-semibold text-[#F50057]">
                                    {c.author.full_name || c.author.email}
                                  </span>
                                  <span
                                    className="text-xs ml-2"
                                    style={{ color: "rgba(160,160,184,0.5)" }}
                                  >
                                    {new Date(c.created_at).toLocaleDateString()}
                                  </span>

                                  {editingId === c.id ? (
                                    <div className="mt-2 space-y-2">
                                      <textarea
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                        rows={3}
                                        className={`w-full ${textareaCls}`}
                                        style={textareaStyle}
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleEdit(c.id, section.id)}
                                          className="btn-primary text-xs px-3 py-1.5 rounded-lg"
                                        >
                                          {t.saveEdit}
                                        </button>
                                        <button
                                          onClick={() => setEditingId(null)}
                                          className="btn-ghost text-xs px-3 py-1.5"
                                        >
                                          {t.cancelEdit}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[#A0A0B8] text-sm mt-1">{c.content}</p>
                                  )}
                                </div>

                                {editingId !== c.id && (
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => { setEditingId(c.id); setEditBody(c.content); }}
                                      className="text-xs text-[#A0A0B8] hover:text-[#E040FB] transition-colors"
                                    >
                                      {t.editComment}
                                    </button>
                                    <button
                                      onClick={() => handleDelete(c.id, section.id)}
                                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                    >
                                      {t.deleteComment}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* New comment box */}
                      <div className="flex gap-3">
                        <textarea
                          value={newComment[section.id] || ""}
                          onChange={(e) =>
                            setNewComment((n) => ({ ...n, [section.id]: e.target.value }))
                          }
                          placeholder={t.commentPlaceholder}
                          rows={2}
                          className={`${textareaCls} focus:border-[#F50057]`}
                          style={{
                            ...textareaStyle,
                            transition: "border-color 150ms ease, box-shadow 150ms ease",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#F50057";
                            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245, 0, 87, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(224, 64, 251, 0.2)";
                            e.currentTarget.style.boxShadow = "";
                          }}
                        />
                        <button
                          onClick={() => handlePost(section.id)}
                          className="btn-primary text-sm font-semibold px-4 py-2 rounded-lg self-end"
                        >
                          {t.submitComment}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
