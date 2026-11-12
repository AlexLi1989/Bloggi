import { matchedData } from "express-validator";
import {
  findPublishedBlogs,
  findAllBlogs,
  findBlog,
  createBlog,
  verifyBlogOwner,
  updateBlog,
  deleteBlog,
} from "../db/blog.js";

//blogs get
async function blogsGet(req, res, next) {
  try {
    const blogs = req.user ? await findAllBlogs() : await findPublishedBlogs();
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return next(error);
  }
}

//blog get
async function blogGet(req, res, next) {
  try {
    const blogId = req.params.id;
    const blog = await findBlog(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    if (!blog.isPublished && !req.user)
      return res
        .status(403)
        .json({ success: false, message: "Forbidden access." });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return next(error);
  }
}

//blog create post
async function blogCreatePost(req, res, next) {
  try {
    const { title, content, isPublished } = matchedData(req);
    const userId = req.user.id;
    const blog = await createBlog({ title, content, isPublished, userId });
    return res.status(201).json({
      success: true,
      blog, //return newly created blog
    });
  } catch (error) {
    return next(error);
  }
}

//blog update put
async function blogUpdatePut(req, res, next) {
  try {
    const { title, content, isPublished } = matchedData(req);
    const userId = req.user.id;
    const blogId = req.params.id;
    await verifyBlogOwner({ userId, blogId });
    const updatedBlog = await updateBlog({
      blogId,
      title,
      content,
      isPublished,
    });
    return res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    return next(error);
  }
}

//blog delete
async function blogDelete(req, res, next) {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    await verifyBlogOwner({ userId, blogId });
    await deleteBlog(blogId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
}

export default { blogsGet, blogGet, blogCreatePost, blogUpdatePut, blogDelete };
