import { Router, Request } from "express";
import multer, { Multer, diskStorage, StorageEngine } from "multer";
import itemController from "../controllers/itemController";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import {
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController";

const router = Router();

const storage: StorageEngine = diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, `${__dirname}/../public/assets`);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, `${Date.now()}.${file.originalname.split(".")[1]}`); // Appending extension
  },
});

const upload: Multer = multer({ storage });

router.get("/", itemController.index);
router.get("/category/:categoryId", itemController.getItemsByCategory);
router.get("/item/create", itemController.getItemCreate);
router.post(
  "/item/create",
  upload.single("image"),
  itemController.postItemCreate
);
router.post("/item/delete", itemController.postItemDelete);
router.get("/item/:itemId", itemController.getItem);
router.get("/item/:itemId/edit", itemController.getItemEdit);
router.post(
  "/item/:itemId/edit",
  upload.single("image"),
  itemController.postItemEdit
);

router.post("/", createCategory);
router.get("/category/delete/:id", deleteCategory);
router.post("/:id", updateCategory);

router.post("/", createBrand);
router.get("/brand/delete/:id", deleteBrand);
router.post("/:id", updateBrand);

export default router;
