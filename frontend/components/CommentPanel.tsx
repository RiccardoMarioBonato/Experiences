import { useState, useEffect } from "react";
import { isAuthenticated, getRole, getName } from "@/lib/auth";
import api from "@/lib/api";
import { MessageSquare, Trash2, Edit2, Send } from "lucide-react";

export default function CommentPanel({ sectionId, initialComments }: { sectionId: number, initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated();
  const role = mounted ? getRole() : null;
  const canComment = isAuth && (role === "admin" || role === "recruiter");

  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/${sectionId}`, { content: newComment });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (commentId: number) => {
    try {
      const res = await api.put(`/comments/${commentId}`, { content: editBody });
      setComments(c => c.map(x => x.id === commentId ? res.data : x));
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Delete comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(c => c.filter(x => x.id !== commentId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 mt-4">
      <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold text-sm">
        <MessageSquare size={16} />
        <h4>Recruiter Feedback ({comments.length})</h4>
      </div>

      <div className="space-y-4 mb-4">
        {comments.map((c) => (
          <div key={c.id} className="bg-slate-800/80 rounded-lg p-3 text-sm">
            <div className="flex justify-between items-start mb-1.5">
              <div className="font-semibold text-indigo-300">
                {c.author?.full_name || "Recruiter"}
                <span className="text-slate-500 text-xs font-normal ml-2">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {canComment && (role === "admin" || getName() === c.author?.full_name) && editingId !== c.id && (
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(c.id); setEditBody(c.content); }} className="text-slate-400 hover:text-white">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {editingId === c.id ? (
              <div className="mt-2 text-right">
                <textarea 
                  value={editBody} 
                  onChange={e => setEditBody(e.target.value)} 
                  className="input text-sm mb-2" rows={2} 
                />
                <button onClick={() => setEditingId(null)} className="btn-ghost py-1 px-3 text-xs mr-2">Cancel</button>
                <button onClick={() => handleEdit(c.id)} className="btn-primary py-1 px-3 text-xs">Save</button>
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed">{c.content}</p>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-slate-500 text-sm italic">No feedback yet.</p>
        )}
      </div>

      {canComment && (
        <div className="flex gap-2 relative">
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add feedback..."
            className="input text-sm pr-10"
            onKeyDown={e => e.key === "Enter" && handlePost()}
          />
          <button 
            onClick={handlePost}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 p-1"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
