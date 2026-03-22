"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import api from "@/lib/api";
import content from "@/content.json";

const { admin: t } = content;

// ─── Types ───────────────────────────────────────────────
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
interface User    { id: number; full_name: string | null; email: string; role: string; created_at: string; }
interface Comment { id: number; content: string; section_id: number; author: { id: number; full_name: string | null; email: string }; created_at: string; }

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"resume" | "recruiters" | "users">("resume");

  // data state
  const [sections,  setSections]  = useState<ResumeSection[]>([]);
  const [users,     setUsers]     = useState<User[]>([]);
  const [comments,  setComments]  = useState<Comment[]>([]);
  const [loading,   setLoading]   = useState(true);

  // form state
  const [showForm,  setShowForm]  = useState(false);
  const [formData,  setFormData]  = useState({
    section_type: "experience",
    title: "",
    subtitle: "",
    description: "",
    start_date: "",
    end_date: "",
    order: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  // ── Auth guard ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "admin") router.push("/login");
  }, [router]);

  // ── Fetch data ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [secRes, userRes, comRes] = await Promise.all([
          api.get("/resume/"),
          api.get("/admin/users"),
          api.get("/admin/comments"),
        ]);
        setSections(secRes.data);
        setUsers(userRes.data);
        setComments(comRes.data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── CRUD handlers ───────────────────────────────────────
  const blankForm = () => ({
    section_type: "experience",
    title: "",
    subtitle: "",
    description: "",
    start_date: "",
    end_date: "",
    order: 0,
  });

  const handleSave = async () => {
    try {
      // strip empty strings to null for optional fields
      const payload = {
        ...formData,
        subtitle:   formData.subtitle   || null,
        description: formData.description || null,
        start_date: formData.start_date || null,
        end_date:   formData.end_date   || null,
      };
      if (editId) {
        const res = await api.put(`/resume/${editId}`, payload);
        setSections(s => s.map(x => x.id === editId ? res.data : x));
      } else {
        const res = await api.post("/resume/", payload);
        setSections(s => [...s, res.data]);
      }
      setShowForm(false);
      setEditId(null);
      setFormData(blankForm());
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this section?")) return;
    try {
      await api.delete(`/resume/${id}`);
      setSections(s => s.filter(x => x.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(u => u.filter(x => x.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments(c => c.filter(x => x.id !== id));
    } catch (err) { console.error(err); }
  };

  const startEdit = (s: ResumeSection) => {
    setEditId(s.id);
    setFormData({
      section_type: s.section_type,
      title:        s.title,
      subtitle:     s.subtitle     ?? "",
      description:  s.description  ?? "",
      start_date:   s.start_date   ?? "",
      end_date:     s.end_date     ?? "",
      order:        s.order,
    });
    setShowForm(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">{t.heading}</h1>
          <p className="text-gray-400 mt-1 text-sm">{t.subheading}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-0">
          {(["resume", "recruiters", "users"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        {/* ── TAB: Resume Sections ── */}
        {activeTab === "resume" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Resume Sections</h2>
              <button
                onClick={() => { setShowForm(true); setEditId(null); setFormData(blankForm()); }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + {t.resumeSection.addButton}
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-4">{editId ? "Edit Section" : "New Section"}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select
                      value={formData.section_type}
                      onChange={e => setFormData(f => ({ ...f, section_type: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm"
                    >
                      {t.resumeSection.sectionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input
                      value={formData.title}
                      onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Software Engineer at Acme"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Subtitle <span className="text-gray-600">(company / institution / tech)</span></label>
                    <input
                      value={formData.subtitle}
                      onChange={e => setFormData(f => ({ ...f, subtitle: e.target.value }))}
                      placeholder="e.g. Kasetsart University"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                      <input
                        value={formData.start_date}
                        onChange={e => setFormData(f => ({ ...f, start_date: e.target.value }))}
                        placeholder="e.g. June 2023"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">End Date</label>
                      <input
                        value={formData.end_date}
                        onChange={e => setFormData(f => ({ ...f, end_date: e.target.value }))}
                        placeholder="e.g. Present"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe this section..."
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Order <span className="text-gray-600">(within section type)</span></label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                      className="w-32 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                      Save
                    </button>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section list */}
            {sections.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">{t.resumeSection.emptyState}</p>
            ) : (
              <div className="space-y-3">
                {sections.map(s => (
                  <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{s.section_type}</span>
                      <h3 className="font-semibold text-white mt-0.5">{s.title}</h3>
                      {s.subtitle && <p className="text-indigo-400 text-sm mt-0.5">{s.subtitle}</p>}
                      {(s.start_date || s.end_date) && (
                        <p className="text-gray-500 text-xs mt-0.5">{s.start_date}{s.start_date && s.end_date && " — "}{s.end_date}</p>
                      )}
                      {s.description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{s.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(s)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                        {t.resumeSection.editButton}
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors">
                        {t.resumeSection.deleteButton}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Recruiter Activity ── */}
        {activeTab === "recruiters" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Recruiter Activity</h2>
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">{t.recruiterSection.emptyState}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {t.recruiterSection.tableHeaders.map(h => (
                        <th key={h} className="text-left text-gray-400 font-semibold py-3 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(c => (
                      <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                        <td className="py-3 px-4 text-white">{c.author?.full_name || c.author?.email}</td>
                        <td className="py-3 px-4 text-gray-300 max-w-xs truncate">{c.content}</td>
                        <td className="py-3 px-4 text-gray-400">Section #{c.section_id}</td>
                        <td className="py-3 px-4 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteComment(c.id)} className="text-xs text-red-400 hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Manage Users ── */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Manage Users</h2>
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">{t.usersSection.emptyState}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {t.usersSection.tableHeaders.map(h => (
                        <th key={h} className="text-left text-gray-400 font-semibold py-3 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                        <td className="py-3 px-4 text-white">{u.full_name || "—"}</td>
                        <td className="py-3 px-4 text-gray-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            u.role === "admin"     ? "bg-purple-500/20 text-purple-300" :
                            u.role === "recruiter" ? "bg-blue-500/20 text-blue-300" :
                            "bg-gray-500/20 text-gray-300"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteUser(u.id)} className="text-xs text-red-400 hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
