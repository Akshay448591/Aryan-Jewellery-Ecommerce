import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Trash2, Heart } from "lucide-react";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      toast.error("Unable to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Remove wishlist error:", err);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your wishlist…
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-6 h-6 text-gray-700" />
        <h1 className="text-3xl font-bold tracking-tight">
          My Wishlist
        </h1>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-gray-600 text-lg">
            Your wishlist is currently empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* Image */}
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-full h-56 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h2 className="font-semibold text-lg truncate">
                  {item.name}
                </h2>

                <p className="text-gray-600 mt-1">
                  ₹{item.price}
                </p>

                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
