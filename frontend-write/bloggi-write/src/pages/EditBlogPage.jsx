import validator from "validator";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function EditBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [modalConfig, setModalConfig] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};

    if (validator.isEmpty(validator.trim(title))) {
      newErrors.title = "Please enter title.";
    } else if (
      !validator.isLength(validator.trim(title), { min: 1, max: 255 })
    ) {
      newErrors.title = "Title must be between 1 and 255 characters.";
    }

    if (validator.isEmpty(validator.trim(content))) {
      newErrors.content = "Please enter content.";
    } else if (
      !validator.isLength(validator.trim(content), { min: 1, max: 50000 })
    ) {
      newErrors.content = "Content must be between 1 and 50,000 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setModalConfig({
        title: "Save Changes",
        message: "Are you sure you want to update this article?",
        confirmText: "Save",
        mode: "primary",
        onConfirm: async () => {
          setIsProcessing(true);
          try {
            await api.put(`/blogs/${id}`, {
              title: validator.trim(title),
              content: validator.trim(content),
              isPublished,
            });
            setModalConfig(null);
            navigate(`/blogs/${id}`);
          } catch (error) {
            setModalConfig({
              title: "Error",
              message:
                error.response?.data?.errors?.[0]?.msg ||
                error.response?.data?.message ||
                "Failed to update article.",
              confirmText: "OK",
              mode: "alert",
              onConfirm: () => setModalConfig(null),
            });
          } finally {
            setIsProcessing(false);
          }
        },
      });
    }
  };

  useEffect(() => {
    setFetchError("");
    setIsLoading(true);
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        const fetchedBlog = res.data.blog;
        setBlog(fetchedBlog);
        setTitle(fetchedBlog.title);
        setContent(fetchedBlog.content);
        setIsPublished(fetchedBlog.isPublished);
      } catch (error) {
        if (error.response?.status == 403) {
          setFetchError("You do not have permission to view this draft.");
        } else if (error.response?.status == 404) {
          setFetchError("Blog not found.");
        } else {
          setFetchError("Failed to load blog.");
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
        Loading articles...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-center space-y-3">
        <p className="font-medium">{fetchError}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center text-sm underline text-black hover:text-blue-900"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <section className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
      <div className="flex flex-col items-start text-left gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Edit your article
        </h1>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {apiError}
          </div>
        )}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20 transition"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600 px-1">{errors.title}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20 transition"
          ></textarea>

          {errors.content && (
            <p className="mt-1 text-xs text-red-600 px-1">{errors.content}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="isPublished"
            className="text-sm font-medium text-stone-700"
          >
            Publish:
          </label>
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
      <ConfirmModal
        isOpen={Boolean(modalConfig)}
        isLoading={isProcessing}
        onCancel={() => setModalConfig(null)}
        {...modalConfig}
      />
    </section>
  );
}
