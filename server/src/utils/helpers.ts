import Item from "../models/item";
import Category from "../models/category";
import { Response, Request, NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

let selected: string;

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

interface IModel {
  aggregate(
    pipeline: object[],
    callback: (err: any, result: unknown) => void
  ): void;
}

const getDetails = (model: IModel) => {
  return new Promise((resolve, reject) => {
    model.aggregate(
      [
        {
          $lookup: {
            from: "items",
            localField: "_id",
            foreignField: model === Category ? "category" : "brand",
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

const doesModelExist = async (model: any, name: string) => {
  const result = await model.findOne({ name: name });
  if (result) {
    throw new Error(`${model.modelName} with name ${name} already exists`);
  }
};

const handleCreateErrors = async (
  res: Response,
  req: Request,
  next: NextFunction,
  errors: Result<ValidationError> | ValidationError[],
  className = "none",
  modelType: any
) => {
  try {
    let sortSelect = req.query.sortSelect;
    if (!sortSelect) {
      sortSelect = "Sort";
    } else if (Array.isArray(sortSelect)) {
      sortSelect = sortSelect.join(",");
    }

    const modelDetails = await getDetails(modelType);
    const items = await Item.find({}, null, {
      sort: setSortType(sortSelect as string),
    });

    const newErrors = Array.isArray(errors)
      ? validationResult(req).formatWith(({ msg }: { msg: string }) => ({
          msg,
        }))
      : errors;

    res.render("index", {
      title: "Products",
      modelDetails,
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

export { doesModelExist, handleCreateErrors };
