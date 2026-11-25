import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const publishedCount = blogs.filter((blog) => {
    return blog.isPublished;
  }).length;
  const draftCount = blogs.length - publishedCount;
  const [modalConfig, setModalConfig] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openDeleteModal = (blogId) => {
    setModalConfig({
      title: "Delete Article",
      message: "Are you sure you want to delete this blog?",
      confirmText: "Delete",
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await api.delete(`/blogs/${blogId}`);
          setBlogs((prev) => prev.filter((b) => b.id !== blogId));
          setModalConfig(null);
        } catch (error) {
          //set modal to alert mode if failed
          setModalConfig({
            title: "Error",
            message: error.response?.data?.message || "Failed to delete blog.",
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

  useEffect(() => {
    setErrors("");
    setIsLoading(true);
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/dashboard/blogs");
        setBlogs(res.data.blogs);
      } catch (error) {
        setErrors(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-stone-500 animate-pulse">
        Loading articles...
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Your stories
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage your published articles and drafts.
          </p>
        </div>
        <Link
          to="/write/new"
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-4 py-1 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-xs"
        >
          + New Story
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white px-4 py-3 sm:p-5 rounded-xl border border-stone-200 shadow-xs flex flex-row sm:flex-col items-center sm:items-stretch justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Total Stories:
          </p>
          <p className="sm:mt-2 text-xl sm:text-2xl font-bold text-stone-900 sm:text-center">
            {blogs.length}
          </p>
        </div>

        <div className="bg-white px-4 py-3 sm:p-5 rounded-xl border border-stone-200 shadow-xs flex flex-row sm:flex-col items-center sm:items-stretch justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Published:
          </p>
          <p className="sm:mt-2 text-xl sm:text-2xl font-bold text-stone-900 sm:text-center">
            {publishedCount}
          </p>
        </div>

        <div className="bg-white px-4 py-3 sm:p-5 rounded-xl border border-stone-200 shadow-xs flex flex-row sm:flex-col items-center sm:items-stretch justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Drafts:
          </p>
          <p className="sm:mt-2 text-xl sm:text-2xl font-bold text-stone-900 sm:text-center">
            {draftCount}
          </p>
        </div>
      </div>
      {errors && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <p>Failed to load Blogs. Please try again later.</p>
        </div>
      )}
      {!errors && blogs.length === 0 ? (
        <div className="py-16 text-center text-stone-500 bg-white rounded-xl border border-stone-200">
          <p>No blogs published yet.</p>
        </div>
      ) : (
        <ul className="space-y-5">
          {blogs &&
            blogs.map((blog) => {
              return (
                <li
                  key={blog.id}
                  className="group bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm hover:shadow-amber-700/25 transition"
                >
                  <Link to={`/blogs/${blog.id}`} className="block">
                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-indigo-600 transition mb-3">
                      {blog.title}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
                    {blog.isPublished ? (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                        Published
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    )}
                  </div>
                  <p>Comment count: {blog._count?.comments || 0}</p>
                  <div className="flex items-center justify-between pt-3 border-stone-100 text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/blogs/${blog.id}`}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        View →
                      </Link>
                      <Link
                        to={`/write/edit/${blog.id}`}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Edit
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(blog.id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
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
