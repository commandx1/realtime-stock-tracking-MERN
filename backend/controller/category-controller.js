const { validationResult } = require("express-validator");
const Category = require("../models/category");
const Product = require("../models/product");

const getCategories = async (req, res) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (err) {
    res.status(500).send({
      message: "Bir şeyler ters gitti, lütfen tekrar deneyiniz.",
    });
  }
  if (!categories) {
    res.status(404).send({
      message: "Kategori bulunamadı.",
    });
  }

  res.json({
    categories: categories.map((category) =>
      category.toObject({ getters: true })
    ),
  });
};

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.cid;

  let category;

  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Bir hata oluştu, lütfen tekrar deneyiniz." });
  }

  if (!category) {
    res.status(500).send({ message: "Böyle bir kategori bulunamadı." });
  }

  res.json({ category: category.toObject({ getters: true }) });
};

const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .send({ message: "Geçersiz kategori ismi. Lütfen tekrar deneyiniz." });
  }
  const { label } = req.body;

  let existingCategory;
  try {
    existingCategory = await Category.findOne({ label });
  } catch (err) {
    res.status(500).send({
      message:
        "Kayıt sırasında bir hata meydana geldi, lütfen tekrar deneyiniz.",
    });
  }

  if (existingCategory) {
    res.status(422).send({
      message:
        "Böyle kategori zaten var, lütfen başka bir kategori ismi giriniz.",
    });
  }

  const createdCategory = new Category({
    label,
    products: [],
  });

  try {
    await createdCategory.save();
  } catch (err) {
    res.status(500).send({
      message:
        "Kayıt sırasında bir hata meydana geldi, lütfen tekrar deneyiniz.",
    });
  }

  res.status(201).json({
    message: `${createdCategory.label} isimli kategori başarıyla oluşturuldu.`,
    category: createdCategory.toObject({ getters: true }),
  });
};

const updateCategory = async (req, res) => {
  const { label } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      message: "Geçersiz kategori ismi. Lütfen tekrar deneyiniz.",
    });
  }

  const categoryId = req.params.cid;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    res.status(500).send({
      message: "Bir şeyler ters gitti.",
    });
  }

  if (!category) {
    res.status(404).send({
      message: "Değiştirmek istediğiniz kategori bulunamadı.",
    });
  }

  let existingCategory;
  try {
    existingCategory = await Category.findOne({ label });
  } catch (err) {
    res.status(500).send({
      message:
        "Güncelleme sırasında bir haya meydana geldi, lütfen tekrar deneyiniz.",
    });
  }

  if (existingCategory && existingCategory.label !== category.label) {
    res.status(422).send({
      message:
        "Böyle kategori zaten var, lütfen başka bir kategori ismi giriniz.",
    });
  }

  category.label = label;

  try {
    await category.save();
  } catch (err) {
    res.status(500).send({
      message: "Bir şeyler ters gitti, değişiklik yapılamadı.",
    });
  }

  res.status(200).json({
    message: "Değişikler başarıyla kaydedildi !",
    category: category.toObject({ getters: true }),
  });
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.cid;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    res.status(500).send({
      message: "Bir şeyler ters gitti, kategori silinemiyor.",
    });
  }

  if (!category) {
    res.status(404).send({
      message: "Böyle bir kategori bulunamadı.",
    });
  }

  try {
    await category.remove();
  } catch (err) {
    res.status(500).send({
      message: "Bir şeyler ters gitti, kategori silinemiyor.",
    });
  }

  try {
    let productIds = category.products.map((product) => product._id);
    await Product.deleteMany({
      _id: {
        $in: productIds,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: "Bir şeyler ters gitti, kategori silinemiyor.",
    });
  }

  res.status(200).json({
    message: "Kategori başarıyla silindi...",
  });
};

exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
