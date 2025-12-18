import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const toastId = toast.loading("Fetching product...");
      try {
        const res = await api.get("/products");
        const product = res.data.find((p) => p._id === id);
        if (!product) {
          toast.error("Product not found", { id: toastId });
          navigate("/admin");
          return;
        }
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
        });
        toast.dismiss(toastId);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to fetch product", { id: toastId });
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      toast.error("Not authorized");
      return;
    }

    const toastId = toast.loading("Updating product...");

    try {
      await api.put(`/products/${id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Product updated successfully!", { id: toastId });
      navigate("/admin");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product", { id: toastId });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
