const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: Number, required: true },
  price_history: { type: Number },
  category: { type: mongoose.Types.ObjectId, required: true, ref: "Category" },
});

module.exports = mongoose.model("Product", productSchema);
