import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage products and inventory
          </p>
        </div>

        <Link
          to="/admin/add-product"
          className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats (REAL DATA ONLY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold mt-1">{products.length}</p>
        </div>

        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500">Admin Actions</p>
          <p className="mt-2 text-gray-700">
            Add, edit, or remove products
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-xl shadow-sm overflow-hidden"
              >
                {/* Image */}
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    ₹{product.price}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Stock: {product.stock}</span>
                    <span>{product.category}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="flex-1 text-center bg-yellow-500 text-white py-1.5 rounded hover:opacity-90"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 text-white py-1.5 rounded hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
