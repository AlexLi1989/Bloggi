import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection.jsx";

export default function BlogDetailPage() {
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const { id } = useParams();

  useEffect(() => {
    setErrors("");
    setIsLoading(true);
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (error) {
        if (error.response?.status == 403) {
          setErrors("You do not have permission to view this draft.");
        } else if (error.response?.status == 404) {
          setErrors("Blog not found.");
        } else {
          setErrors("Failed to load blog.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-stone-500 animate-pulse">
        Loading article...
      </div>
    );
  }

  if (errors) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center space-y-3">
        <p className="font-medium">{errors}</p>
        <Link
          to="/dashboard"
          className="inline-block text-sm underline hover:text-red-900"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="space-y-10">
      {/* 頂部導覽與編輯快捷按鈕 */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-stone-500 hover:text-stone-900 transition"
        >
          ← Back to Dashboard
        </Link>
        <Link
          to={`/write/edit/${blog.id}`}
          className="px-4 py-1.5 rounded-lg border border-stone-300 bg-white text-sm font-medium text-stone-700 hover:bg-stone-100 transition"
        >
          Edit Article
        </Link>
      </div>

      {/* 文章標頭與內文卡片 */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <header className="border-b border-stone-100 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <span className="font-semibold text-stone-800">
              {blog.user.username}
            </span>
            <span>•</span>
            <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
            {blog.isPublished ? (
              <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                Published
              </span>
            ) : (
              <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                Draft
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
            {blog.title}
          </h1>
        </header>

        <div className="text-stone-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>

      <CommentSection initialComments={blog.comments} />
    </article>
  );
}
