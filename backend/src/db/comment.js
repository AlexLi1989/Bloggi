import prisma from "../lib/prisma.js";

async function createComment({ blogId, userId, content }) {
  try {
    const comment = await prisma.comment.create({
      data: { blogId, userId, content },
      include: { user: { select: { id: true, username: true } } },
    });
    return comment;
  } catch (error) {
    console.error("Failed to create comment: ", error);
    throw error;
  }
}

async function deleteComment({ commentId, userId }) {
  try {
    //find comment and parent blog by commentId
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { blog: true },
    });
    //verify user is blog owner
    if (!comment || comment.blog.userId !== userId) {
      const error = new Error("Access Denied");
      error.status = 404; //mask with 404
      throw error;
    }
    await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (error) {
    console.error("Failed to delete comment: ", error);
    throw error;
  }
}

export { createComment, deleteComment };
