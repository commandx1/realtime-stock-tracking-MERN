const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/category");
const Product = require("../models/product");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    res.status(500).send({
      message: "Bir hatayla karşılaşıldı. Ürünler yüklenemiyor.",
    });
  }
  if (!products) {
    res.status(500).send({ message: "Bir şeyler ters gitti." });
  }
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Bir şeyler ters gitti, lütfen tekrar deneyiniz." });
  }
  if (!product) {
    res.status(404).send({ message: "Ürün bulunamadı." });
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductsByCategory = async (req, res, next) => {
  const categoryId = req.params.cid;
  let products;
  try {
    products = await Product.find({ category: categoryId });
  } catch (err) {
    res.status(500).send({
      message: "Bir hatayla karşılaşıldı. Ürünler yüklenemiyor !",
    });
  }
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .send({ message: "Bilgiler geçersiz. Lütfen tekrar deneyiniz." });
  }

  const { name, price } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Bir şeyler ters gitti, değişiklik yapılamadı." });
  }

  if (product.name === name && product.price === price) {
    res.status(200).json({
      message: {
        type: "warning",
        content: "Değişiklik yapmadınız.",
      },
      product: product.toObject({ getters: true }),
    });
  } else if (price !== product.price) {
    const oldPrice = product.price;
    product.price_history = oldPrice;
    product.price = price;
  }

  product.name = name;

  try {
    await product.save();
  } catch (err) {
    res
      .status(500)
      .send({ message: "Bir şeyler ters gitti, değişiklik yapılamadı." });
  }

  res.status(200).json({
    message: {
      type: "success",
      content: "Değişiklikler başarıyla kaydedildi.",
    },
    product: product.toObject({ getters: true }),
  });
};

// const addImage = async (req, res, next) => {
//   const memoryId = req.params.mid;

//   let memory;
//   try {
//     memory = await Memory.findById(memoryId);
//   } catch (err) {
//     const error = new HttpError(
//       "Bir şeyler ters gitti, fotoğraf eklenemiyor.",
//       500
//     );
//     return next(error);
//   }

//   if (!memory) {
//     const error = new HttpError("Böyle bir anı bulunamadı", 404);
//     return next(error);
//   }
//   let myFile = req.file.originalname.split(".");
//   const fileType = myFile[myFile.length - 1];

//   let veri;

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${uuidv4()}.${fileType}`,
//     Body: req.file.buffer,
//   };

//   s3.upload(params, async (error, data) => {
//     if (error) {
//       res.status(500).send(error);
//     }
//     veri = data.Key;

//     memory.imageUrl = veri;

//     try {
//       await memory.save();
//     } catch (error) {
//       const err = new HttpError(
//         "Bir şeyler ters gitti, fotoğraf eklenemiyor.",
//         500
//       );
//       return next(err);
//     }

//     res.status(201).json({
//       message: {
//         type: "success",
//         content: "Fotoğraf eklendi 😊",
//       },
//       memory: memory,
//     });
//   });
// };

// const deleteImage = async (req, res, next) => {
//   const memoryId = req.params.mid;

//   let memory;
//   try {
//     memory = await Memory.findById(memoryId).populate("kullanici");
//   } catch (err) {
//     const error = new HttpError(
//       "Bir şeyler ters gitti, fotoğraf kaldırılamıyor.",
//       500
//     );
//     return next(error);
//   }

//   if (!memory) {
//     const error = new HttpError("Böyle bir anı bulunamadı", 404);
//     return next(error);
//   }

//   const imagePath = memory.imageUrl;

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: imagePath,
//   };

//   s3.deleteObject(params, async (error, data) => {
//     if (error) {
//       const err = new HttpError(
//         "Bir şeyler ters gitti, fotoğraf silinemiyor.",
//         500
//       );
//       return next(err);
//     }

//     memory.imageUrl = "";

//     try {
//       await memory.save();
//     } catch (error) {
//       const err = new HttpError(
//         "Bir şeyler ters gitti, fotoğraf silinemiyor.",
//         500
//       );
//       return next(err);
//     }

//     res.status(200).json({
//       message: {
//         type: "info",
//         content: "Fotoğraf başarıyla silindi.",
//       },
//     });
//   });
// };

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate("category");
  } catch (err) {
    req
      .status(500)
      .send({ message: "Bir şeyler ters gitti, ürün silinemiyor." });
  }

  if (!product) {
    res.status(404).send({ message: "Ürün bulunamadı." });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess });
    product.category.products.pull(product);
    await product.category.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    res
      .status(500)
      .send({ message: "Bir şeyler ters gitti, ürün silinemiyor." });
  }

  const imagePath = product.img;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imagePath,
  };

  s3.deleteObject(params, (error, data) => {
    if (error) {
      res
        .status(500)
        .send({ message: "Bir şeyler ters gitti, ürün silinemiyor." });
    }

    res.status(200).json({
      message: {
        type: "info",
        content: "Ürün başarıyla silindi.",
      },
    });
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      message: "Geçersiz ürün bilgisi. Lütfen tekrar deneyiniz.",
    });
  }

  const { name, price, categoryId } = req.body;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    res.status(500).send({
      message: "Ürün eklenirken hata meydana geldi, lütfen tekrar deneyiniz",
    });
  }

  if (!category) {
    res.status(404).send({
      message: "Kategori bulunamadı.",
    });
  }

  let createdProduct;

  let requestFile = req.file.originalname.split(".");
  const fileType = requestFile[requestFile.length - 1];

  let imgSource;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, async (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    imgSource = data.Key;

    createdProduct = new Product({
      name,
      img: imgSource,
      category: categoryId,
      price,
    });

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdProduct.save({ session: sess });
      category.products.push(createdProduct);
      await category.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      res.status(500).send({
        message: "Ürün eklenirken hata meydana geldi, lütfen tekrar deneyiniz.",
      });
    }
    res
      .status(201)
      .json({ product: createdProduct.toObject({ getters: true }) });
  });
};

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getProductsByCategory = getProductsByCategory;
exports.updateProduct = updateProduct;
exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
