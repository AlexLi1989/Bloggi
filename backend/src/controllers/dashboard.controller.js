import { findUserBlogs } from "../db/blog.js";

async function userBlogsGet(req, res, next) {
  try {
    const userId = req.user.id;
    const blogs = await findUserBlogs({ userId });
    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(error);
  }
}

export default { userBlogsGet };
