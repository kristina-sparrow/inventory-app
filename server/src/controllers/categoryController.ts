import { Request, Response, NextFunction } from "express";
import { ValidationError, body, validationResult } from "express-validator";
import Category from "../models/category";
import { doesModelExist, handleCreateErrors } from "../utils/helpers";

const createCategory = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name cannot be empty")
    .custom(async (value) => {
      await doesModelExist(Category, value);
    }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        handleCreateErrors(res, req, next, errors, "none", Category);
        return;
      }

      const category = new Category({ name: req.body.name });
      await category.save();

      res.redirect("/categories");
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];

const updateCategory = [
  body("categoryName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name cannot be empty"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        handleCreateErrors(
          res,
          req,
          next,
          errors.array(),
          req.body.editBtn,
          Category
        );
        return;
      }

      const result = await Category.findOne({ name: req.body.categoryName });

      if (result !== null) {
        const itemExist: ValidationError[] = [
          {
            location: "body",
            param: "categoryName",
            value: req.body.categoryName,
            msg: "category name must be unique",
          },
        ];
        handleCreateErrors(
          res,
          req,
          next,
          itemExist,
          req.body.editBtn,
          Category
        );
        return;
      }

      await Category.findByIdAndUpdate(req.body.categoryId, {
        name: req.body.categoryName,
      });

      res.redirect("/products");
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
];

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect("/products");
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export { createCategory, updateCategory, deleteCategory };
