import { useState, useEffect } from "react";
import { isAuthenticated, getRole, getName } from "@/lib/auth";
import api from "@/lib/api";
import { MessageSquare, Trash2, Edit2, Send } from "lucide-react";

export default function CommentPanel({
  sectionId,
  initialComments,
}: {
  sectionId: number;
  initialComments: any[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [mounted, setMounted] = useState(false);
  const [newCommentIds, setNewCommentIds] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
      setNewCommentIds((prev) => new Set([...prev, res.data.id]));
      setTimeout(() => {
        setNewCommentIds((prev) => {
          const next = new Set(prev);
          next.delete(res.data.id);
          return next;
        });
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (commentId: number) => {
    try {
      const res = await api.put(`/comments/${commentId}`, { content: editBody });
      setComments((c) => c.map((x) => (x.id === commentId ? res.data : x)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Delete comment?")) return;
    setDeletingId(commentId);
    setTimeout(async () => {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments((c) => c.filter((x) => x.id !== commentId));
      } catch (err) {
        console.error(err);
      }
      setDeletingId(null);
    }, 200);
  };

  return (
    <div
      className="rounded-xl p-5 mt-4"
      style={{
        background: "rgba(19, 17, 26, 0.6)",
        border: "1px solid rgba(224, 64, 251, 0.15)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 font-semibold text-sm" style={{ color: "#A0A0B8" }}>
        <MessageSquare size={16} className="text-[#E040FB]" />
        <h4>Recruiter Feedback ({comments.length})</h4>
      </div>

      <div className="space-y-3 mb-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg p-3 text-sm ${
              newCommentIds.has(c.id) ? "animate-slide-down" : ""
            } ${deletingId === c.id ? "comment-exit" : ""}`}
            style={{
              background: "rgba(224, 64, 251, 0.06)",
              border: "1px solid rgba(224, 64, 251, 0.12)",
            }}
          >
            <div className="flex justify-between items-start mb-1.5">
              <div className="font-semibold text-[#E040FB]">
                {c.author?.full_name || "Recruiter"}
                <span className="text-xs font-normal ml-2" style={{ color: "#A0A0B8" }}>
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>

              {canComment &&
                (role === "admin" || getName() === c.author?.full_name) &&
                editingId !== c.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditBody(c.content);
                      }}
                      className="text-[#A0A0B8] hover:text-[#E040FB] transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
            </div>

            {editingId === c.id ? (
              <div className="mt-2 text-right">
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="input text-sm mb-2"
                  rows={2}
                />
                <button
                  onClick={() => setEditingId(null)}
                  className="btn-ghost py-1 px-3 text-xs mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEdit(c.id)}
                  className="btn-primary py-1 px-3 text-xs"
                >
                  Save
                </button>
              </div>
            ) : (
              <p style={{ color: "#A0A0B8" }} className="leading-relaxed">
                {c.content}
              </p>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm italic" style={{ color: "rgba(160, 160, 184, 0.5)" }}>
            No feedback yet.
          </p>
        )}
      </div>

      {canComment && (
        <div className="flex gap-2 relative">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add feedback..."
            className="input text-sm pr-10"
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
          />
          <button
            onClick={handlePost}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#E040FB] hover:text-[#F50057] transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
