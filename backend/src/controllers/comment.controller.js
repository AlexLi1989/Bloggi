import { matchedData } from "express-validator";
import { createComment, deleteComment } from "../db/comment.js";

async function commentCreatePost(req, res, next) {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { content } = matchedData(req);
    const comment = await createComment({ blogId, userId, content });
    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    return next(error);
  }
}

async function commentDelete(req, res, next) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    await deleteComment({ commentId, userId });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}

export default { commentCreatePost, commentDelete };
