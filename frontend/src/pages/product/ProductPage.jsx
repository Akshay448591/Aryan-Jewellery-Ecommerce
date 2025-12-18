import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get("/products");
        const prod = res.data.find((p) => p._id === id);
        if (!prod) {
          toast.error("Product not found");
          return;
        }
        setProduct(prod);
        setSelectedImage(prod.images?.[0]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // Check wishlist
  useEffect(() => {
    if (!user) return;
    const checkWishlist = async () => {
      try {
        const res = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInWishlist(res.data.some((item) => item._id === id));
      } catch (err) {
        console.error(err);
      }
    };
    checkWishlist();
  }, [id, user]);

  if (!product) return <p className="p-6">Loading...</p>;

  // Wishlist
  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      if (inWishlist) {
        await api.delete(`/wishlist/remove/${product._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await api.post(
          `/wishlist/add/${product._id}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Wishlist action failed");
    }
  };

  // Cart
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    try {
      await api.post(
        `/cart/add/${product._id}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" />

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* IMAGES */}
          <div className="lg:w-1/2">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[420px] object-cover rounded-xl border"
              />
            )}

            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={product.name}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border
                    ${
                      selectedImage === img
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="lg:w-1/2 flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium">Stock:</span>{" "}
                {product.stock}
              </p>
            </div>

            <p className="text-2xl font-bold">
              ₹{product.price}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-3 rounded-lg
                           font-medium hover:opacity-90 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                className={`flex-1 py-3 rounded-lg font-medium transition
                  ${
                    inWishlist
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
              >
                {inWishlist
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
