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

export default function RecruiterPage() {
  const router = useRouter();
  const [sections,     setSections]     = useState<ResumeSection[]>([]);
  const [comments,     setComments]     = useState<Record<number, Comment[]>>({});
  const [newComment,   setNewComment]   = useState<Record<number, string>>({});
  const [editingId,    setEditingId]    = useState<number | null>(null);
  const [editBody,     setEditBody]     = useState("");
  const [loading,      setLoading]      = useState(true);
  const [activeSec,    setActiveSec]    = useState<number | null>(null);

  // ── Auth guard ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated() || (getRole() !== "recruiter" && getRole() !== "admin")) {
      router.push("/login");
    }
  }, [router]);

  // ── Fetch resume sections then comments ─────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/resume/");
        setSections(res.data);

        // fetch comments for each section: GET /comments/{section_id}
        const commentMap: Record<number, Comment[]> = {};
        await Promise.all(res.data.map(async (s: ResumeSection) => {
          const c = await api.get(`/comments/${s.id}`);
          commentMap[s.id] = c.data;
        }));
        setComments(commentMap);
      } catch (err) {
        console.error("Failed to load recruiter data", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Comment handlers ────────────────────────────────────
  const handlePost = async (sectionId: number) => {
    const body = newComment[sectionId]?.trim();
    if (!body) return;
    try {
      // POST /comments/{section_id}  body: { content }
      const res = await api.post(`/comments/${sectionId}`, { content: body });
      setComments(c => ({ ...c, [sectionId]: [...(c[sectionId] || []), res.data] }));
      setNewComment(n => ({ ...n, [sectionId]: "" }));
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (commentId: number, sectionId: number) => {
    try {
      // PUT /comments/{comment_id}  body: { content }
      const res = await api.put(`/comments/${commentId}`, { content: editBody });
      setComments(c => ({
        ...c,
        [sectionId]: c[sectionId].map(x => x.id === commentId ? res.data : x)
      }));
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (commentId: number, sectionId: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(c => ({ ...c, [sectionId]: c[sectionId].filter(x => x.id !== commentId) }));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading portfolio...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black">{t.heading}</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Signed in as <span className="text-purple-400">{getName()}</span> · {t.subheading}
          </p>
        </div>

        {/* Resume sections */}
        {sections.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-16">No resume content available yet.</p>
        ) : (
          <div className="space-y-6">
            {sections.map(section => (
              <div key={section.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

                {/* Section header toggle */}
                <button
                  onClick={() => setActiveSec(activeSec === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="text-left">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{section.section_type}</span>
                    <h2 className="text-lg font-bold text-white mt-0.5">{section.title}</h2>
                    {section.subtitle && <p className="text-indigo-400 text-sm">{section.subtitle}</p>}
                    {(section.start_date || section.end_date) && (
                      <p className="text-gray-500 text-xs mt-0.5">{section.start_date}{section.start_date && section.end_date && " — "}{section.end_date}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {comments[section.id]?.length || 0} comment{comments[section.id]?.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-gray-500 text-sm">{activeSec === section.id ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Expanded content */}
                {activeSec === section.id && (
                  <div className="px-6 pb-6 border-t border-gray-800">

                    {/* Section description */}
                    {section.description && (
                      <div className="py-5">
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{section.description}</p>
                      </div>
                    )}

                    {/* Comments */}
                    <div className={section.description ? "border-t border-gray-800 pt-5" : "pt-5"}>
                      <h3 className="text-sm font-semibold text-gray-300 mb-4">Comments</h3>

                      {(!comments[section.id] || comments[section.id].length === 0) ? (
                        <p className="text-gray-600 text-sm mb-4">{t.emptyComments}</p>
                      ) : (
                        <div className="space-y-3 mb-5">
                          {comments[section.id].map(c => (
                            <div key={c.id} className="bg-gray-800 rounded-xl px-4 py-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <span className="text-xs font-semibold text-purple-300">
                                    {c.author.full_name || c.author.email}
                                  </span>
                                  <span className="text-xs text-gray-600 ml-2">
                                    {new Date(c.created_at).toLocaleDateString()}
                                  </span>

                                  {editingId === c.id ? (
                                    <div className="mt-2 space-y-2">
                                      <textarea
                                        value={editBody}
                                        onChange={e => setEditBody(e.target.value)}
                                        rows={3}
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm resize-none"
                                      />
                                      <div className="flex gap-2">
                                        <button onClick={() => handleEdit(c.id, section.id)} className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg">
                                          {t.saveEdit}
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-white px-3 py-1.5">
                                          {t.cancelEdit}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-300 text-sm mt-1">{c.content}</p>
                                  )}
                                </div>

                                {/* Edit/delete buttons — only when not in edit mode */}
                                {editingId !== c.id && (
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => { setEditingId(c.id); setEditBody(c.content); }}
                                      className="text-xs text-gray-400 hover:text-white"
                                    >
                                      {t.editComment}
                                    </button>
                                    <button
                                      onClick={() => handleDelete(c.id, section.id)}
                                      className="text-xs text-red-400 hover:text-red-300"
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
                          onChange={e => setNewComment(n => ({ ...n, [section.id]: e.target.value }))}
                          placeholder={t.commentPlaceholder}
                          rows={2}
                          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => handlePost(section.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors self-end"
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
