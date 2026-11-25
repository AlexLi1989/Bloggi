import validator from "validator";
import { useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

export default function CommentSection({ initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [modalConfig, setModalConfig] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openDeleteModal = (commentId) => {
    setModalConfig({
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment?",
      confirmText: "Delete",
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await api.delete(`/comments/${commentId}`);
          setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId),
          );
          setModalConfig(null);
        } catch (error) {
          //set modal to alert mode if failed
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
      <h2 className="pt-3 text-xl font-bold text-stone-900">
        Comments ({comments.length})
      </h2>
      {comments.length === 0 ? (
        <p className="text-sm text-stone-500 py-4">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments &&
            comments.map((comment) => {
              return (
                <li
                  key={comment.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 space-y-2"
                >
                  <div className="flex justify-between items-center text-xs text-stone-500">
                    <span className="font-semibold text-stone-800">
                      {comment.user.username}
                    </span>{" "}
                    <time>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(comment.id)}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
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
