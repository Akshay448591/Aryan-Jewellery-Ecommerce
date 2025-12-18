import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    images.forEach((img) => data.append("images", img));

    const toastId = toast.loading("Adding product...");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      await api.post("/products/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!", { id: toastId });
      navigate("/admin");
    } catch (err) {
      console.error("Add Product Error:", err);
      toast.error("Failed to add product", { id: toastId });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
      >
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Category */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Images
          </label>

          <label
            htmlFor="product-images"
            className="flex flex-col items-center justify-center w-full h-36
                       border-2 border-dashed border-gray-300 rounded-xl cursor-pointer
                       bg-gray-50 hover:bg-gray-100 transition"
          >
            <p className="text-sm font-semibold text-gray-700">
              Click to upload images
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or JPEG (multiple allowed)
            </p>
          </label>

          <input
            id="product-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="hidden"
          />

          {/* Preview */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
