const express = require("express");
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const multer = require("multer");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/add", protect, admin, upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id", protect, admin, updateProduct);

module.exports = router;
