import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Processing: "bg-blue-100 text-blue-700 border-blue-300",
  Shipped: "bg-purple-100 text-purple-700 border-purple-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

const ManageOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(res.data);
    } catch {
      setError("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, status) => {
    await api.put(
      `/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );
  };

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl shadow-sm p-6 grid grid-rows-[auto_1fr_auto]"
          >
            {/* HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mb-4">
              <div className="md:col-span-2">
                <p className="font-semibold">
                  Order ID: <span className="text-gray-600">{order._id}</span>
                </p>

                {order.user?.name && (
                  <p className="text-sm text-gray-500">User: {order.user.name}</p>
                )}

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex md:justify-end">
                <span
                  className={`px-3 py-1 rounded-full border text-sm font-medium ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex flex-wrap justify-between items-center gap-4 pt-4 mt-4 border-t">
              <p className="text-lg font-semibold">Total: ₹{order.totalAmount}</p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Update Status:</span>

                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`px-3 py-1 rounded border text-sm font-medium focus:outline-none ${statusStyles[order.status]}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
