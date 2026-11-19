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
    <section>
      {!isAuthenticated ? (
        <p>
          Please
          <Link to="/login"> log in</Link> to leave a comment.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {apiError && <div>{apiError}</div>}
          <div>
            <label htmlFor="content">Leave a comment: </label>
            <textarea
              id="content"
              name="content"
              value={commentContent}
              onChange={(e) => {
                setCommentContent(e.target.value);
              }}
              required
            />
            {errors.commentContent && <p>{errors.commentContent}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Commenting..." : "Comment"}
          </button>
        </form>
      )}
      <div>
        <h4>Comments: </h4>
        <ul>
          {comments &&
            comments.map((comment) => {
              return (
                <li key={comment.id}>
                  <p>Commented by: {comment.user.username}</p>
                  <p>{comment.content}</p>
                  <p>{new Date(comment.createdAt).toLocaleDateString()}</p>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}
