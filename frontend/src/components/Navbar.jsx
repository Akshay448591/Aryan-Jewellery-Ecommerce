import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  PackagePlus,
  ClipboardList,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

const hoverAnim = {
  whileHover: { y: -2 },
  transition: { type: "spring", stiffness: 300 },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const value = search.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
    );

    setSuggestions(filtered.slice(0, 6));
  }, [search, products]);

  const NavLinks = () => (
    <>
      {!user && (
        <>
          <Link to="/login" className="flex items-center gap-2">
            <LogIn size={16} /> Login
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500 text-amber-600"
          >
            <UserPlus size={16} /> Register
          </Link>
        </>
      )}

      {user && user.role === "user" && (
        <>
          <Link to="/wishlist" className="flex items-center gap-2">
            <Heart size={16} /> Wishlist
          </Link>

          <Link to="/cart" className="flex items-center gap-2">
            <ShoppingCart size={16} /> Cart
          </Link>

          <Link to="/profile" className="flex items-center gap-2">
            <User size={16} /> Profile
          </Link>

          <Link to="/my-orders" className="flex items-center gap-2">
            <ClipboardList size={16} /> Orders
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300"
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      )}

      {user && user.role === "admin" && (
        <>
          <Link to="/admin" className="flex items-center gap-2">
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          <Link to="/admin/manage-orders" className="flex items-center gap-2">
            <ClipboardList size={16} /> Orders
          </Link>

          <Link to="/admin/add-product" className="flex items-center gap-2">
            <PackagePlus size={16} /> Add Product
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300"
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-semibold whitespace-nowrap"
          >
            <span className="text-amber-500">Aryan</span> Jewellerys
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block relative w-full max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full px-4 py-2 text-sm border rounded-full focus:ring-2 focus:ring-amber-500"
            />

            {suggestions.length > 0 && (
              <div className="absolute top-11 w-full bg-white border rounded-xl shadow-lg">
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      navigate(`/?search=${item.name}`);
                      setSearch("");
                      setSuggestions([]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({item.category})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLinks />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jewellery..."
            className="w-full px-4 py-2 text-sm border rounded-full"
          />

          {suggestions.length > 0 && (
            <div className="absolute top-11 w-full bg-white border rounded-xl shadow-lg">
              {suggestions.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    navigate(`/?search=${item.name}`);
                    setSearch("");
                    setSuggestions([]);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 flex flex-col gap-4 text-sm"
            >
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
