import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ================= BRAND ================= */}
        <div>
          <h2 className="text-xl font-bold tracking-wide">
            Aryan Jewellerys
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xs">
            Crafting timeless jewellery with elegance, purity, and trust.
            Designed to shine with every moment of your life.
          </p>
        </div>

        {/* ================= LINKS ================= */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-black transition">
                Home
              </Link>
            </li>

            {!user && (
              <>
                <li>
                  <Link to="/login" className="hover:text-black transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-black transition">
                    Register
                  </Link>
                </li>
              </>
            )}

            {user && user.role === "user" && (
              <>
                <li>
                  <Link to="/profile" className="hover:text-black transition">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="hover:text-black transition">
                    My Orders
                  </Link>
                </li>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <li>
                  <Link to="/admin" className="hover:text-black transition">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/manage-orders"
                    className="hover:text-black transition"
                  >
                    Manage Orders
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* ================= INFO ================= */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-600">
            Email: support@aryanjewellerys.com
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Phone: +91 90000 00000
          </p>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Aryan Jewellerys. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
