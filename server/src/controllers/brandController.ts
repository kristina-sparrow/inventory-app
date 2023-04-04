import { Request, Response, NextFunction } from "express";
import { ValidationError, body, validationResult } from "express-validator";
import Brand from "../models/brand";
import { doesModelExist, handleCreateErrors } from "../utils/helpers";

const createBrand = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand name cannot be empty")
    .custom(async (value) => {
      await doesModelExist(Brand, value);
    }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        handleCreateErrors(res, req, next, errors, "none", Brand);
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
        handleCreateErrors(
          res,
          req,
          next,
          errors.array(),
          req.body.editBtn,
          Brand
        );
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
        handleCreateErrors(res, req, next, itemExist, req.body.editBtn, Brand);
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

export { createBrand, updateBrand, deleteBrand };
