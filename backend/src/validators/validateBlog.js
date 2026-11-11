import { body } from "express-validator";

const validateBlog = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters.")
    .escape(),
  body("content")
    .isLength({ min: 1, max: 50000 })
    .withMessage("Content must be less than 50,000 characters."),
  body("isPublished").optional().isBoolean(),
];

export default validateBlog;
