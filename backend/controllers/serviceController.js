
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — COMPLETE PREMIUM SERVICE CONTROLLER

   FEATURES:
   1. Public Active Services
   2. Admin Services CRUD
   3. Search by Name, ID, Description and Category
   4. Category Aliases
   5. Pagination
   6. Image URL Validation and Storage
   7. MongoDB ID / Service ID Lookup
   8. Activate / Deactivate Services
===================================================== */

const mongoose = require("mongoose");
const Service = require("../models/Service");

// =====================================================
// CATEGORY ALIASES
// =====================================================

const CATEGORY_ALIASES = {
  "Skin Care": [
    "skin care",
    "skin-care",
    "skin_care",
    "skincare",
    "skin",
    "facial",
    "facials",
  ],

  "Bridal Care": [
    "bridal care",
    "bridal-care",
    "bridal_care",
    "bridalcare",
    "bridal",
    "engagement",
    "wedding",
  ],

  "Mehndi Care": [
    "mehndi care",
    "mehndi-care",
    "mehndi_care",
    "mehndicare",
    "mehndi",
    "henna",
    "mehandi",
  ],
};

// =====================================================
// NORMALIZE CATEGORY
// =====================================================

const normalizeCategory = (category) => {
  if (typeof category !== "string") {
    return null;
  }

  const normalized = category
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  for (const [canonical, aliases] of Object.entries(
    CATEGORY_ALIASES
  )) {
    const matches = aliases.some(
      (alias) =>
        alias.replace(/[\s_-]+/g, "") === normalized
    );

    if (matches) {
      return canonical;
    }
  }

  return null;
};

// =====================================================
// GET CATEGORY ALIASES
// =====================================================

const getCategoryAliases = (category) => {
  const canonical = normalizeCategory(category);

  if (!canonical) {
    return [];
  }

  return CATEGORY_ALIASES[canonical];
};

// =====================================================
// ESCAPE REGEX
// =====================================================

const escapeRegex = (value) => {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// =====================================================
// NORMALIZE IMAGE URL
// =====================================================

const normalizeImage = (image) => {
  if (image === undefined || image === null) {
    return "";
  }

  if (typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (!value) {
    return "";
  }

  // Accept HTTP / HTTPS image URLs.
  if (/^https?:\/\/\S+$/i.test(value)) {
    try {
      const parsed = new URL(value);

      if (
        !["http:", "https:"].includes(parsed.protocol)
      ) {
        return null;
      }

      return value;
    } catch {
      return null;
    }
  }

  // Accept relative uploaded image paths.
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("..")
  ) {
    return value;
  }

  return null;
};

// =====================================================
// BUILD SERVICE FILTER
// =====================================================

const buildServiceFilter = (query = {}, admin = false) => {
  const {
    search = "",
    category = "",
    isActive,
  } = query;

  const filter = {};

  // PUBLIC: only active services.
  if (!admin) {
    filter.isActive = true;
  } else if (isActive === "true") {
    filter.isActive = true;
  } else if (isActive === "false") {
    filter.isActive = false;
  }

  // CATEGORY FILTER
  if (
    typeof category === "string" &&
    category.trim()
  ) {
    const aliases = getCategoryAliases(category);

    if (aliases.length > 0) {
      filter.category = {
        $in: aliases.map(
          (alias) =>
            new RegExp(
              `^${escapeRegex(alias)}$`,
              "i"
            )
        ),
      };
    } else {
      // Invalid category returns no results.
      filter.category = {
        $in: [],
      };
    }
  }

  // SEARCH FILTER
  // Search name, service ID, description and category.
  if (
    typeof search === "string" &&
    search.trim()
  ) {
    const safeSearch = escapeRegex(search.trim());

    filter.$or = [
      {
        name: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        serviceId: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        category: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  return filter;
};

// =====================================================
// FETCH SERVICES WITH PAGINATION
// =====================================================

const fetchServices = async (req, res, admin = false) => {
  try {
    const pageValue = Number.parseInt(
      req.query.page,
      10
    );

    const limitValue = Number.parseInt(
      req.query.limit,
      10
    );

    const currentPage =
      Number.isFinite(pageValue) && pageValue > 0
        ? Math.min(pageValue, 1000000)
        : 1;

    const perPage =
      Number.isFinite(limitValue) && limitValue > 0
        ? Math.min(limitValue, 100)
        : 10;

    const filter = buildServiceFilter(
      req.query,
      admin
    );

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .lean(),

      Service.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      message: admin
        ? "Admin services fetched successfully."
        : "Services fetched successfully.",

      services,

      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
        hasNextPage:
          currentPage < Math.ceil(total / perPage),
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "GLOWAURA FETCH SERVICES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch services.",
    });
  }
};

// =====================================================
// GET ACTIVE SERVICES — PUBLIC
// GET /api/services
// =====================================================

const getAllServices = async (req, res) => {
  return fetchServices(req, res, false);
};

// =====================================================
// GET ALL SERVICES — ADMIN
// GET /api/services/admin
// =====================================================

const getAdminServices = async (req, res) => {
  console.log(
    "GLOWAURA ADMIN SERVICES CONTROLLER HIT ❤️"
  );

  return fetchServices(req, res, true);
};

// =====================================================
// GET SINGLE ACTIVE SERVICE
// GET /api/services/:id
// MongoDB ID OR serviceId
// =====================================================

const getServiceById = async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required.",
      });
    }

    const conditions = [
      {
        serviceId: id.toLowerCase(),
      },
    ];

    if (mongoose.isValidObjectId(id)) {
      conditions.push({
        _id: id,
      });
    }

    const service = await Service.findOne({
      $or: conditions,
      isActive: true,
    }).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Active service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error(
      "GLOWAURA GET SERVICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch service.",
    });
  }
};

// =====================================================
// VALIDATE SERVICE DATA
// =====================================================

const validateServiceData = (
  data,
  partial = false
) => {
  const errors = [];

  // SERVICE NAME
  if (!partial || data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      errors.push("Service name is required.");
    }
  }

  // DESCRIPTION
  if (!partial || data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      errors.push("Service description is required.");
    }
  }

  // CATEGORY
  if (!partial || data.category !== undefined) {
    if (
      typeof data.category !== "string" ||
      !normalizeCategory(data.category)
    ) {
      errors.push(
        "Category must be Skin Care, Bridal Care or Mehndi Care."
      );
    }
  }

  // PRICE
  if (!partial || data.price !== undefined) {
    const price = Number(data.price);

    if (
      data.price === "" ||
      data.price === null ||
      data.price === undefined ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      errors.push(
        "Enter a valid non-negative service price."
      );
    }
  }

  // DURATION
  if (!partial || data.duration !== undefined) {
    if (
      typeof data.duration !== "string" ||
      !data.duration.trim()
    ) {
      errors.push("Service duration is required.");
    }
  }

  // RATING
  if (data.rating !== undefined) {
    const rating = Number(data.rating);

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      errors.push(
        "Rating must be between 0 and 5."
      );
    }
  }

  // IMAGE
  if (data.image !== undefined) {
    if (normalizeImage(data.image) === null) {
      errors.push(
        "Image must be a valid HTTP/HTTPS URL or relative upload path."
      );
    }
  }

  // ACTIVE STATUS
  if (
    data.isActive !== undefined &&
    typeof data.isActive !== "boolean"
  ) {
    errors.push(
      "isActive must be true or false."
    );
  }

  return errors;
};

// =====================================================
// CREATE SERVICE — ADMIN
// POST /api/services
// =====================================================

const createService = async (req, res) => {
  try {
    const {
      serviceId,
      name,
      description,
      category,
      price,
      duration,
      image,
      rating,
    } = req.body;

    if (
      typeof serviceId !== "string" ||
      !serviceId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required.",
      });
    }

    const validationErrors = validateServiceData({
      name,
      description,
      category,
      price,
      duration,
      image,
      rating,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const normalizedId = serviceId
      .trim()
      .toLowerCase();

    const existingService = await Service.findOne({
      serviceId: normalizedId,
    }).lean();

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service ID already exists.",
      });
    }

    const normalizedImage = normalizeImage(image);

    const service = await Service.create({
      serviceId: normalizedId,
      name: name.trim(),
      description: description.trim(),
      category: normalizeCategory(category),
      price: Number(price),
      duration: duration.trim(),
      image: normalizedImage || "",
      rating:
        rating === undefined ? 0 : Number(rating),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    console.error(
      "GLOWAURA CREATE SERVICE ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Service ID already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create service.",
    });
  }
};

// =====================================================
// UPDATE SERVICE — ADMIN
// PATCH /api/services/:id
// =====================================================

const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "duration",
      "image",
      "rating",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const validationErrors = validateServiceData(
      updates,
      true
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    if (updates.category !== undefined) {
      updates.category = normalizeCategory(
        updates.category
      );
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.duration !== undefined) {
      updates.duration = updates.duration.trim();
    }

    if (updates.image !== undefined) {
      updates.image = normalizeImage(updates.image);
    }

    if (updates.rating !== undefined) {
      updates.rating = Number(updates.rating);
    }

    const service = await Service.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    console.error(
      "GLOWAURA UPDATE SERVICE ERROR:",
      error
    );

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update service.",
    });
  }
};

// =====================================================
// DELETE SERVICE — ADMIN
// DELETE /api/services/:id
// =====================================================

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error(
      "GLOWAURA DELETE SERVICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete service.",
    });
  }
};

// =====================================================
// ACTIVATE / DEACTIVATE SERVICE — ADMIN
// PATCH /api/services/:id/status
// =====================================================

const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Service activated successfully."
        : "Service deactivated successfully.",
      service,
    });
  } catch (error) {
    console.error(
      "GLOWAURA TOGGLE SERVICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to change service status.",
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  getAllServices,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
};
