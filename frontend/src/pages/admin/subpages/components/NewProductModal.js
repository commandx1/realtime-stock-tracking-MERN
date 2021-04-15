import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/modal/Modal";
import useHttpClient from "../../../../hooks/useHttpClient";
import { addProduct } from "../../../../store/actions/product";

const NewProductModal = ({ closeModal, openModal }) => {
  const { categories } = useSelector((state) => state);
  const { sendRequest } = useHttpClient();
  const dispatch = useDispatch();

  const initialProduct = {
    name: "",
    price: 0,
    image: "",
    category: categories[0].id,
  };

  const [product, setProduct] = useState(initialProduct);

  const imageHandler = (e) => {
    const reader = new FileReader();
    // reader.onload = () => {
    //   if (reader.readyState === 2)
    //     setNewImage({ ...newImage, download_url: reader.result });
    // };

    reader.readAsDataURL(e.target.files[0]);
    setProduct({ ...product, image: e.target.files[0] });
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    console.log(product);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("categoryId", product.category);
      formData.append("image", product.image);
      const response = await sendRequest(
        "http://localhost:5000/api/products",
        "POST",
        formData
      );
      dispatch(addProduct(response.product));
      closeModal();
    } catch (error) {}
  };

  const handleChange = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setProduct({ ...product, [inputName]: inputValue });
  };

  return (
    <Modal onClose={closeModal} openModal={openModal}>
      {categories.length > 0 ? (
        <form onSubmit={formSubmit}>
          <select
            value={product.category}
            onChange={(e) => {
              setProduct({ ...product, category: e.target.value });
            }}
            className="form-control"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={imageHandler}
          />
          <input
            name="name"
            type="text"
            value={product.name}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary">
            Ürünü Ekle
          </button>
        </form>
      ) : (
        "Kategori bulunamadı. Ürün ekleyebilmek için önce kategori eklemelisiniz."
      )}
    </Modal>
  );
};

export default NewProductModal;
