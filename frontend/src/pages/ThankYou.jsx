import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

const ThankYou = () => {
  const { state } = useLocation();
  const payment = state?.payment; // optional payment details from Razorpay

  useEffect(() => {
    toast.success("Order placed successfully!");
  }, []);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <Toaster position="top-right" />
      
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          🎉 Thank You!
        </h1>
        <p className="mb-6 text-gray-700">
          Your order has been placed successfully.
        </p>

        {payment && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 text-left text-sm">
            <p className="font-semibold mb-2">Payment Details:</p>
            <p><span className="font-medium">Payment ID:</span> {payment.razorpay_payment_id}</p>
            <p><span className="font-medium">Order ID:</span> {payment.razorpay_order_id}</p>
            <p><span className="font-medium">Signature:</span> {payment.razorpay_signature}</p>
          </div>
        )}

        <Link
          to="/my-orders"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
