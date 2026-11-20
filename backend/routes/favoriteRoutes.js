
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — FAVOURITE ARTISTS ROUTES */

const express = require("express");
const router = express.Router();

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// FAVOURITE ARTISTS CONTROLLER
// ==========================================

const {
  getAvailableArtists,
  getFavoriteArtists,
  addFavoriteArtist,
  removeFavoriteArtist,
} = require("../controllers/favoriteController");

// ==========================================
// PROTECT ALL FAVOURITE ROUTES
// ==========================================

router.use(protect);

// ==========================================
// GET ALL AVAILABLE VERIFIED ARTISTS
// GET: /api/favorites/artists
// ==========================================

router.get("/artists", getAvailableArtists);

// ==========================================
// GET MY FAVOURITE ARTISTS
// GET: /api/favorites
// ==========================================

router.get("/", getFavoriteArtists);

// ==========================================
// ADD ARTIST TO FAVOURITES
// POST: /api/favorites/:artistId
// ==========================================

router.post("/:artistId", addFavoriteArtist);

// ==========================================
// REMOVE ARTIST FROM FAVOURITES
// DELETE: /api/favorites/:artistId
// ==========================================

router.delete("/:artistId", removeFavoriteArtist);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
