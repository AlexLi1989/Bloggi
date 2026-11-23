import validator from "validator";
import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function CommentSection({ blogId, initialComments }) {
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};

    //comment validation
    if (validator.isEmpty(commentContent, { ignore_whitespace: true })) {
      newErrors.commentContent = "Comment cannot be empty.";
    } else if (!validator.isLength(commentContent, { min: 1, max: 1000 })) {
      newErrors.commentContent =
        "Comment must be between 1 and 1000 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true); //to prevent repeat submitting
      //send data
      try {
        const res = await api.post(`/blogs/${blogId}/comments`, {
          content: validator.trim(commentContent),
        });
        setComments((prev) => [res.data.comment, ...prev]);
        setCommentContent("");
      } catch (error) {
        const message =
          error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Failed to create comment, please try again.";
        setApiError(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="pt-3 text-xl font-bold text-stone-900">
        Comments ({comments.length})
      </h2>
      {!isAuthenticated ? (
        <div className="p-5 rounded-xl bg-stone-100 border border-stone-200 text-sm text-stone-600 text-center">
          Please{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            log in
          </Link>{" "}
          to join the discussion.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white p-5 rounded-xl border border-stone-200
          space-y-4
        "
        >
          {apiError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {apiError}
            </div>
          )}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Leave a comment:
            </label>
            <textarea
              id="content"
              name="content"
              value={commentContent}
              onChange={(e) => {
                setCommentContent(e.target.value);
              }}
              required
              className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-800/10 transition min-h-20"
            />
            {errors.commentContent && (
              <p className="mt-1 text-xs text-red-600">
                {errors.commentContent}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}
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
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
