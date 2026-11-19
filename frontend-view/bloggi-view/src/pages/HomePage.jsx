import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    setErrors("");
    setIsLoading(true);
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
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
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Latest Stories
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Thoughts, ideas, and stories from our writers.
        </p>
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
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="font-medium text-stone-700">
                      {blog.user.username}
                    </span>
                    <span>•</span>
                    <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
                    {!blog.isPublished && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    )}
                  </div>

                  <Link to={`/blogs/${blog.id}`} className="block">
                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-indigo-600 transition mb-3">
                      {blog.title}
                    </h2>
                  </Link>

                  <Link
                    to={`/blogs/${blog.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Read article →
                  </Link>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
