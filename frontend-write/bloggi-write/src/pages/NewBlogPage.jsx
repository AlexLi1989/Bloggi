import validator from "validator";
import { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};

    //title validation
    if (validator.isEmpty(validator.trim(title))) {
      newErrors.title = "Please enter title.";
    } else if (
      !validator.isLength(validator.trim(title), { min: 1, max: 255 })
    ) {
      newErrors.title = "Title must be between 1 and 255 characters.";
    }

    //content validation
    if (validator.isEmpty(validator.trim(content))) {
      newErrors.content = "Please enter content.";
    } else if (
      !validator.isLength(validator.trim(content), { min: 1, max: 50000 })
    ) {
      newErrors.content = "Content must be between 1 and 50,000 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true); //to prevent repeat submitting
      //send data
      try {
        await api.post("/blogs", {
          title: validator.trim(title),
          content: validator.trim(content),
          isPublished,
        });
        return navigate("/");
      } catch (error) {
        const message =
          error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Failed to post article, please try again.";
        setApiError(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
      <div className="border-b border-stone-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Post a new article
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Write your story and choose whether to publish it now or save as a
          draft.
        </p>
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
            row="12"
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
        <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
          <label
            htmlFor="isPublished"
            className="text-sm font-medium text-stone-700 cursor-pointer select-none"
          >
            Publish immediately
          </label>
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
        >
          {isSubmitting ? "Posting..." : "Post article"}
        </button>
      </form>
    </section>
  );
}
