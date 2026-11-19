import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    return <p>Loading...</p>;
  }

  if (errors) {
    return (
      <section>
        <p>{errors}</p>
      </section>
    );
  }

  if (!blog) return null;

  return (
    <section>
      <h2>Blog</h2>
      <>
        <div>
          <h3>{blog.title}</h3>
          <p>Created by: {blog.user.username}</p>
          <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
          <p>{blog.content}</p>
        </div>
        <CommentSection
          blogId={blog.id}
          initialComments={blog.comments}
        ></CommentSection>
      </>
    </section>
  );
}
