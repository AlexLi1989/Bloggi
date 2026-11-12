import prisma from "../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

async function findPublishedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        isPublished: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return blogs;
  } catch (error) {
    console.error("failed to fetch published blogs: ");
    throw error;
  }
}

async function findAllBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        isPublished: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return blogs;
  } catch (error) {
    console.error("failed to fetch all blogs: ");
    throw error;
  }
}

async function findBlog(blogId) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });
    return blog;
  } catch (error) {
    console.error("failed to fetch blog: ");
    throw error;
  }
}

async function createBlog({ title, content, isPublished, userId }) {
  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        isPublished,
        userId,
      },
    });
    return blog;
  } catch (error) {
    console.error("failed to create blog: ");
    throw error;
  }
}

async function verifyBlogOwner(userId, blogId) {
  try {
    //not findUnique as it only allows @id
    const blog = await prisma.blog.findFirst({
      where: { id: blogId, userId },
    });
    if (!blog) {
      const error = new Error("Access Denied");
      error.status = 404; //mask with 404
      throw error;
    }
    return blog;
  } catch (error) {
    console.error("Failed to verify blog owner: ", error);
    throw error;
  }
}

async function updateBlog({ blogId, title, content, isPublished }) {
  try {
    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: { title, content, isPublished },
    });
    return blog;
  } catch (error) {
    console.error("Failed to update blog: ", error);
    throw error;
  }
}

async function deleteBlog(blogId) {
  try {
    await prisma.blog.delete({
      where: { id: blogId },
    });
  } catch (error) {
    console.error("Failed to delete blog: ", error);
    throw error;
  }
}

export {
  findPublishedBlogs,
  findAllBlogs,
  findBlog,
  createBlog,
  verifyBlogOwner,
  updateBlog,
  deleteBlog,
};
