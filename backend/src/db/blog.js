import prisma from "../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

async function findPublishedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({ where: { isPublished: true } });
    return blogs;
  } catch (error) {
    console.error("failed to fetch published blogs: ");
    throw error;
  }
}

async function findAllBlogs() {
  try {
    const blogs = await prisma.blog.findMany();
    return blogs;
  } catch (error) {
    console.error("failed to fetch all blogs: ");
    throw error;
  }
}

async function findBlog() {}

async function createBlog() {}

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

async function updateBlog() {}

async function deleteBlog() {}

export default {
  findPublishedBlogs,
  findAllBlogs,
  findBlog,
  createBlog,
  verifyBlogOwner,
  updateBlog,
  deleteBlog,
};
