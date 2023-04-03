import { Router, Request, Response } from "express";
const router = Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: any) {
  res.redirect("/products");
});

export default router;
