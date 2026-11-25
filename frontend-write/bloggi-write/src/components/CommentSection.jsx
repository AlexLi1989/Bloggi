import { useState } from "react";
import api from "../api/axios.js";
import ConfirmModal from "./ConfirmModal.jsx";

export default function CommentSection({ initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [modalConfig, setModalConfig] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openDeleteModal = (commentId) => {
    setModalConfig({
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment?",
      confirmText: "Delete",
      mode: "danger",
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await api.delete(`/comments/${commentId}`);
          setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId),
          );
          setModalConfig(null);
        } catch (error) {
          setModalConfig({
            title: "Error",
            message:
              error.response?.data?.message || "Failed to delete comment.",
            confirmText: "OK",
            mode: "alert",
            onConfirm: () => setModalConfig(null),
          });
        } finally {
          setIsProcessing(false);
        }
      },
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-stone-900">
        Comments ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <div className="p-8 text-center text-sm text-stone-500 bg-white rounded-xl border border-stone-200">
          No comments on this article yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white p-5 rounded-xl border border-stone-200 space-y-2.5"
            >
              <div className="flex justify-between items-center text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">
                    {comment.user.username}
                  </span>
                  <span>•</span>
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>

                <button
                  type="button"
                  onClick={() => openDeleteModal(comment.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={Boolean(modalConfig)}
        isLoading={isProcessing}
        onCancel={() => setModalConfig(null)}
        {...modalConfig}
      />
    </section>
  );
}
