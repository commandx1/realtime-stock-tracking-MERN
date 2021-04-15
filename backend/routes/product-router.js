const express = require("express");
const { check } = require("express-validator");
const productController = require("../controller/product-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProductById);

router.get("/category/:cid", productController.getProductsByCategory);

router.post(
  "/",
  fileUpload.single("image"),
  [check("name").not().isEmpty(), check("price").not().isEmpty()],
  productController.createProduct
);

router.patch(
  "/:pid",
  [check("name").not().isEmpty(), check("price").not().isEmpty()],
  productController.updateProduct
);

// router.patch(
//   "/image/:mid",
//   fileUpload.single('image'),
//   productController.addImage
// );

router.delete("/:pid", productController.deleteProduct);

// router.delete("/image/:mid", productController.deleteImage);

module.exports = router;
