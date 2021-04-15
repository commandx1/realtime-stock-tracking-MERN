const express = require("express");
const { check } = require("express-validator");
const categoryController = require("../controller/category-controller");

const router = express.Router();

router.get("/", categoryController.getCategories);

router.get("/:cid", categoryController.getCategoryById);

router.post(
  "/",
  check("label").not().isEmpty(),
  categoryController.createCategory
);

router.patch(
  "/:cid",
  check("label").not().isEmpty(),
  categoryController.updateCategory
);

router.delete("/:cid", categoryController.deleteCategory);

module.exports = router;
