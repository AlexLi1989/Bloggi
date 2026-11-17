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
    return <p>Loading...</p>;
  }

  return (
    <section>
      <h2>Blogs</h2>
      {errors && <p>Failed to load Blogs.</p>}
      {!errors && blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul>
          {blogs &&
            blogs.map((blog) => {
              return (
                <li key={blog.id}>
                  <h3>{blog.title}</h3>
                  <p>{blog.user.username}</p>
                  <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                  {!blog.isPublished && <span>[Draft]</span>}
                  <Link to={`/blogs/${blog.id}`}>Show more</Link>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
