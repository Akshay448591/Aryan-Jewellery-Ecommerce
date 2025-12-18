import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProductPage from "./pages/product/ProductPage";
import Cart from "./pages/Cart";
import WishlistPage from "./pages/Wishlist";

import Profile from "./pages/user/Profile";
import MyOrders from "./pages/user/MyOrders";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import ManageOrders from "./pages/admin/ManageOrders";

import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";

import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

/* =========================
   Page animation wrapper
========================= */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="min-h-full bg-white"
  >
    {children}
  </motion.div>
);

/* =========================
   Animated Routes
========================= */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* -------- PUBLIC -------- */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductPage /></PageWrapper>} />

        {/* -------- USER -------- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <PageWrapper><MyOrders /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PageWrapper><Cart /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <PageWrapper><WishlistPage /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/thank-you" element={<PageWrapper><ThankYou /></PageWrapper>} />

        {/* -------- ADMIN -------- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <PageWrapper><AddProduct /></PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <PageWrapper><EditProduct /></PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-orders"
          element={
            <AdminRoute>
              <PageWrapper><ManageOrders /></PageWrapper>
            </AdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/* =========================
   Main App
========================= */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
          <Navbar />

          <main className="flex-1 overflow-hidden bg-white">
            <AnimatedRoutes />
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
