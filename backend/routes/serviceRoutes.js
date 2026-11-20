
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — FINAL SERVICE MANAGEMENT ROUTES */

const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  getAllServices,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} = require("../controllers/serviceController");

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET: All active services
// No login required.
router.get("/", getAllServices);

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET: All services for admin
router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminServices
);

// POST: Create new service
router.post(
  "/",
  protect,
  adminOnly,
  createService
);

// PUT: Update existing service
router.put(
  "/:id",
  protect,
  adminOnly,
  updateService
);

// DELETE: Delete service
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteService
);

// PATCH: Activate / deactivate service
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  toggleServiceStatus
);

// ==========================================
// DYNAMIC PUBLIC ROUTE — KEEP LAST
// ==========================================

// GET: Single active service
// Supports MongoDB ID or serviceId.
router.get(
  "/:id",
  getServiceById
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;
