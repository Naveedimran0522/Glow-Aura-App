
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — FAVOURITE ARTISTS CONTROLLER */

const mongoose = require("mongoose");
const User = require("../models/User");

// ==========================================
// GET ALL AVAILABLE VERIFIED ARTISTS
// ==========================================

exports.getAvailableArtists = async (req, res) => {
  try {
    const artists = await User.find({
      role: "artist",
      isVerified: true,
    })
      .select("_id name role")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    console.error("GET AVAILABLE ARTISTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load artists.",
    });
  }
};

// ==========================================
// GET MY FAVOURITE ARTISTS
// ==========================================

exports.getFavoriteArtists = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("favoriteArtists")
      .populate({
        path: "favoriteArtists",
        select: "name role isVerified",
        match: {
          role: "artist",
          isVerified: true,
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const artists = (user.favoriteArtists || []).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    console.error("GET FAVOURITE ARTISTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load favourite artists.",
    });
  }
};

// ==========================================
// ADD FAVOURITE ARTIST
// ==========================================

exports.addFavoriteArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(artistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID.",
      });
    }

    const artist = await User.findOne({
      _id: artistId,
      role: "artist",
      isVerified: true,
    }).select("_id name role");

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Verified artist not found.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          favoriteArtists: artist._id,
        },
      },
      {
        new: true,
      }
    ).select("favoriteArtists");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Artist added to favourites.",
      artist,
    });
  } catch (error) {
    console.error("ADD FAVOURITE ARTIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add favourite artist.",
    });
  }
};

// ==========================================
// REMOVE FAVOURITE ARTIST
// ==========================================

exports.removeFavoriteArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(artistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          favoriteArtists: artistId,
        },
      },
      {
        new: true,
      }
    ).select("favoriteArtists");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Artist removed from favourites.",
    });
  } catch (error) {
    console.error("REMOVE FAVOURITE ARTIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove favourite artist.",
    });
  }
};
