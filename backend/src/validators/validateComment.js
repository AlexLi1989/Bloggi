import { body } from "express-validator";

const validateComment = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be less than 1,000 characters."),
];

export default validateComment;
