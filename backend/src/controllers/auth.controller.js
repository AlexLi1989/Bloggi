import { matchedData } from "express-validator";
import { createUser, findUser } from "../db/user.js";
import jwt from "jsonwebtoken";

//signup post
async function userCreatePost(req, res, next) {
  try {
    const { email, password, username } = matchedData(req);
    const dbUser = await createUser({ email, password, username });
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}

//login post
async function userLoginPost(req, res, next) {
  const { email, password } = req.body;
  try {
    const dbUser = await findUser({ email, password });
    if (!dbUser) {
      return res.status(401).json({
        success: false,
      });
    }
    const userPayload = { userId: dbUser.id };
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "12h" });
    return res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    return next(error);
  }
}

export default { userCreatePost, userLoginPost };
