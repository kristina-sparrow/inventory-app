import { Request, Response, NextFunction } from "express";
import Item from "../models/item";
import Category from "../models/category";
import {
  Result,
  ValidationError,
  body,
  validationResult,
} from "express-validator";

let selected: string;

const createCategory = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name cannot be empty")
    .custom((value) => doesCategoryExist(value)),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        handleCreateErrors(res, req, next, errors);
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
        handleCreateErrors(res, req, next, errors.array(), req.body.editBtn);
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
        handleCreateErrors(res, req, next, itemExist, req.body.editBtn);
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

// helpers
const setSortType = (sortType: string): { [key: string]: number } => {
  if (sortType === "Price Low-High") {
    selected = "Price Low-High";
    return { price: 1 };
  } else if (sortType === "Price High-Low") {
    selected = "Price High-Low";
    return { price: -1 };
  } else if (sortType === "Name Z-A") {
    selected = "Name Z-A";
    return { name: -1 };
  } else if (sortType === "Name A-Z") {
    selected = "Name A-Z";
    return { name: 1 };
  } else {
    return { _id: 1 };
  }
};

const getCategoryDetails = () => {
  return new Promise((resolve, reject) => {
    Category.aggregate(
      [
        {
          $lookup: {
            from: "items",
            localField: "_id",
            foreignField: "category",
            as: "array",
          },
        },
        {
          $addFields: {
            total: { $size: "$array" },
          },
        },
        {
          $sort: { name: 1 },
        },
      ],
      (err: any, result: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const doesCategoryExist = (name: string) => {
  return Category.findOne({ name: name }).then((category) => {
    if (category) {
      return Promise.reject("Category already exists");
    }
  });
};

const handleCreateErrors = async (
  res: Response,
  req: Request,
  next: NextFunction,
  errors: Result<ValidationError> | ValidationError[],
  className = "none"
) => {
  try {
    let sortSelect = req.query.sortSelect;
    if (!sortSelect) {
      sortSelect = "Sort";
    } else if (Array.isArray(sortSelect)) {
      sortSelect = sortSelect.join(",");
    }

    const categoryDetails = await getCategoryDetails();
    const items = await Item.find({}, null, {
      sort: setSortType(sortSelect as string),
    });

    const newErrors = Array.isArray(errors)
      ? validationResult(req).formatWith(({ msg }) => ({ msg }))
      : errors;

    res.render("index", {
      title: "Products",
      categoryDetails,
      items,
      selected: selected,
      errors: newErrors.array(),
      className: className,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { createCategory, updateCategory, deleteCategory };
