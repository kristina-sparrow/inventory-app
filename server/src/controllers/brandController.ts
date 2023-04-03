import { Request, Response, NextFunction } from "express";
import Item from "../models/item";
import Brand from "../models/brand";
import {
  Result,
  ValidationError,
  body,
  validationResult,
} from "express-validator";

let selected: string;

const createBrand = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand name cannot be empty")
    .custom((value) => doesBrandExist(value)),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        handleCreateErrors(res, req, next, errors);
        return;
      }

      const brand = new Brand({ name: req.body.name });
      await brand.save();

      res.redirect("/categories");
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];

const updateBrand = [
  body("brandName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand name cannot be empty"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        handleCreateErrors(res, req, next, errors.array(), req.body.editBtn);
        return;
      }

      const result = await Brand.findOne({ name: req.body.brandName });

      if (result !== null) {
        const itemExist: ValidationError[] = [
          {
            location: "body",
            param: "brandName",
            value: req.body.brandName,
            msg: "brand name must be unique",
          },
        ];
        handleCreateErrors(res, req, next, itemExist, req.body.editBtn);
        return;
      }

      await Brand.findByIdAndUpdate(req.body.brandId, {
        name: req.body.brandName,
      });

      res.redirect("/products");
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
];

const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Brand.findByIdAndRemove(req.params.id);
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

const getBrandDetails = () => {
  return new Promise((resolve, reject) => {
    Brand.aggregate(
      [
        {
          $lookup: {
            from: "items",
            localField: "_id",
            foreignField: "brand",
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

const doesBrandExist = (name: string) => {
  return Brand.findOne({ name: name }).then((brand) => {
    if (brand) {
      return Promise.reject("Brand already exists");
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

    const brandDetails = await getBrandDetails();
    const items = await Item.find({}, null, {
      sort: setSortType(sortSelect as string),
    });

    const newErrors = Array.isArray(errors)
      ? validationResult(req).formatWith(({ msg }) => ({ msg }))
      : errors;

    res.render("index", {
      title: "Products",
      brandDetails,
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

export { createBrand, updateBrand, deleteBrand };
