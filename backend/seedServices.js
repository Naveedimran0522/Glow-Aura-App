
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — 30 PREMIUM SERVICES DATABASE SEED

   10 Skin Care
   10 Bridal Care
   10 Mehndi Care

   Existing service IDs are updated.
   Missing service IDs are created.
   Existing records are NOT deleted.
===================================================== */

const dns = require("dns");
require("dotenv").config();

const mongoose = require("mongoose");
const Service = require("./models/Service");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// =====================================================
// IMAGE URL HELPER
// =====================================================

const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

// =====================================================
// 30 SERVICES
// =====================================================

const services = [

  // ===================================================
  // SKIN CARE — 10 SERVICES
  // ===================================================

  {
    serviceId: "skin-01",
    name: "Radiance Glow Facial",
    description: "A luxurious facial treatment designed to refresh dull skin and reveal a radiant natural glow.",
    category: "Skin Care",
    price: 1499,
    duration: "60 min",
    image: unsplash("photo-1570172619644-dfd03ed5d881"),
    rating: 4.8,
  },
  {
    serviceId: "skin-02",
    name: "Hydra Care Facial",
    description: "Deep hydration treatment that leaves skin feeling soft, fresh and nourished.",
    category: "Skin Care",
    price: 1999,
    duration: "75 min",
    image: unsplash("photo-1608248543803-ba4f8c70ae0b"),
    rating: 4.9,
  },
  {
    serviceId: "skin-03",
    name: "Gold Luxury Facial",
    description: "A premium gold-inspired facial experience for a refreshed and luminous appearance.",
    category: "Skin Care",
    price: 2499,
    duration: "75 min",
    image: unsplash("photo-1556229010-6c3f2c9ca5f8"),
    rating: 4.8,
  },
  {
    serviceId: "skin-04",
    name: "Deep Cleansing Facial",
    description: "A cleansing facial treatment to remove everyday impurities and refresh the skin.",
    category: "Skin Care",
    price: 1299,
    duration: "50 min",
    image: unsplash("photo-1616394584738-fc6e612e71b9"),
    rating: 4.7,
  },
  {
    serviceId: "skin-05",
    name: "Vitamin C Brightening Facial",
    description: "A refreshing brightening facial experience for a healthy-looking complexion.",
    category: "Skin Care",
    price: 1799,
    duration: "60 min",
    image: unsplash("photo-1598440947619-2c35fc9aa908"),
    rating: 4.8,
  },
  {
    serviceId: "skin-06",
    name: "Pearl Glow Facial",
    description: "A luxurious skin-refreshing treatment inspired by a soft pearl-like glow.",
    category: "Skin Care",
    price: 2199,
    duration: "70 min",
    image: unsplash("photo-1601049541289-9b1b7bbbfe19"),
    rating: 4.9,
  },
  {
    serviceId: "skin-07",
    name: "Aloe Vera Soothing Facial",
    description: "A calming facial experience focused on refreshing and soothing the skin.",
    category: "Skin Care",
    price: 1399,
    duration: "55 min",
    image: unsplash("photo-1608248543803-ba4f8c70ae0b"),
    rating: 4.7,
  },
  {
    serviceId: "skin-08",
    name: "Rose Petal Facial",
    description: "A gentle rose-inspired beauty treatment for a refreshed and pampered experience.",
    category: "Skin Care",
    price: 1899,
    duration: "60 min",
    image: unsplash("photo-1570172619644-dfd03ed5d881"),
    rating: 4.8,
  },
  {
    serviceId: "skin-09",
    name: "Premium Skin Polishing",
    description: "A professional skin polishing session designed to improve the look of skin texture.",
    category: "Skin Care",
    price: 2299,
    duration: "60 min",
    image: unsplash("photo-1556229010-6c3f2c9ca5f8"),
    rating: 4.8,
  },
  {
    serviceId: "skin-10",
    name: "Luxury Bridal Skin Prep",
    description: "A pre-event skincare session to help prepare your skin for your special occasion.",
    category: "Skin Care",
    price: 2999,
    duration: "90 min",
    image: unsplash("photo-1598440947619-2c35fc9aa908"),
    rating: 5.0,
  },

  // ===================================================
  // BRIDAL CARE — 10 SERVICES
  // ===================================================

  {
    serviceId: "bridal-01",
    name: "Bridal Glow Package",
    description: "A premium bridal beauty experience designed for your special wedding celebration.",
    category: "Bridal Care",
    price: 7999,
    duration: "3 hours",
    image: unsplash("photo-1522335789203-aabd1fc54bc9"),
    rating: 5.0,
  },
  {
    serviceId: "bridal-02",
    name: "Engagement Makeup",
    description: "Elegant makeup styling for your engagement ceremony and memorable moments.",
    category: "Bridal Care",
    price: 4999,
    duration: "2 hours",
    image: unsplash("photo-1487412720507-e7ab37603c6f"),
    rating: 4.9,
  },
  {
    serviceId: "bridal-03",
    name: "Royal Bridal Makeup",
    description: "A sophisticated bridal makeup experience with a glamorous and elegant finish.",
    category: "Bridal Care",
    price: 9999,
    duration: "3 hours",
    image: unsplash("photo-1512496015851-a90fb38ba796"),
    rating: 5.0,
  },
  {
    serviceId: "bridal-04",
    name: "HD Bridal Makeup",
    description: "Professional HD makeup styling for beautiful wedding photography and celebrations.",
    category: "Bridal Care",
    price: 8999,
    duration: "2.5 hours",
    image: unsplash("photo-1524250502761-1ac6f2e30d43"),
    rating: 4.9,
  },
  {
    serviceId: "bridal-05",
    name: "Reception Makeup",
    description: "A glamorous reception look created to complement your special evening outfit.",
    category: "Bridal Care",
    price: 6999,
    duration: "2 hours",
    image: unsplash("photo-1522335789203-aabd1fc54bc9"),
    rating: 4.8,
  },
  {
    serviceId: "bridal-06",
    name: "Bridal Hairstyling",
    description: "Beautiful bridal hairstyling designed to complement your wedding-day look.",
    category: "Bridal Care",
    price: 3499,
    duration: "90 min",
    image: unsplash("photo-1487412720507-e7ab37603c6f"),
    rating: 4.8,
  },
  {
    serviceId: "bridal-07",
    name: "Bridal Draping",
    description: "Professional saree and bridal dupatta draping for a graceful traditional appearance.",
    category: "Bridal Care",
    price: 1999,
    duration: "45 min",
    image: unsplash("photo-1512496015851-a90fb38ba796"),
    rating: 4.7,
  },
  {
    serviceId: "bridal-08",
    name: "Pre-Wedding Beauty Package",
    description: "A curated beauty preparation experience before your wedding celebrations.",
    category: "Bridal Care",
    price: 5999,
    duration: "2.5 hours",
    image: unsplash("photo-1524250502761-1ac6f2e30d43"),
    rating: 4.9,
  },
  {
    serviceId: "bridal-09",
    name: "Bridal Eye Makeup",
    description: "Detailed eye makeup styling for an expressive and elegant bridal look.",
    category: "Bridal Care",
    price: 2499,
    duration: "60 min",
    image: unsplash("photo-1522335789203-aabd1fc54bc9"),
    rating: 4.8,
  },
  {
    serviceId: "bridal-10",
    name: "Complete Wedding Look",
    description: "A complete occasion styling experience combining makeup and bridal finishing touches.",
    category: "Bridal Care",
    price: 11999,
    duration: "4 hours",
    image: unsplash("photo-1487412720507-e7ab37603c6f"),
    rating: 5.0,
  },

  // ===================================================
  // MEHNDI CARE — 10 SERVICES
  // ===================================================

  {
    serviceId: "mehndi-01",
    name: "Bridal Mehndi Design",
    description: "Intricate traditional bridal mehndi artistry for your wedding celebration.",
    category: "Mehndi Care",
    price: 5999,
    duration: "4 hours",
    image: pexels(40347701),
    rating: 5.0,
  },
  {
    serviceId: "mehndi-02",
    name: "Arabic Mehndi Design",
    description: "Beautiful flowing Arabic henna patterns with elegant floral details.",
    category: "Mehndi Care",
    price: 1999,
    duration: "90 min",
    image: pexels(6883468),
    rating: 4.8,
  },
  {
    serviceId: "mehndi-03",
    name: "Full Hand Mehndi",
    description: "Detailed full-hand mehndi artistry with traditional decorative patterns.",
    category: "Mehndi Care",
    price: 2999,
    duration: "2 hours",
    image: pexels(32029488),
    rating: 4.9,
  },
  {
    serviceId: "mehndi-04",
    name: "Rajasthani Bridal Mehndi",
    description: "Traditional Rajasthani-inspired bridal henna with intricate cultural motifs.",
    category: "Mehndi Care",
    price: 6999,
    duration: "5 hours",
    image: pexels(36354616),
    rating: 5.0,
  },
  {
    serviceId: "mehndi-05",
    name: "Floral Mehndi Design",
    description: "Graceful floral henna patterns with delicate leaves and decorative details.",
    category: "Mehndi Care",
    price: 1499,
    duration: "75 min",
    image: pexels(36581309),
    rating: 4.8,
  },
  {
    serviceId: "mehndi-06",
    name: "Minimal Mehndi Design",
    description: "Simple and elegant henna patterns for a modern minimal look.",
    category: "Mehndi Care",
    price: 999,
    duration: "45 min",
    image: pexels(35719241),
    rating: 4.7,
  },
  {
    serviceId: "mehndi-07",
    name: "Engagement Mehndi",
    description: "Elegant mehndi artistry for engagement ceremonies and special occasions.",
    category: "Mehndi Care",
    price: 3499,
    duration: "2.5 hours",
    image: pexels(30370332),
    rating: 4.9,
  },
  {
    serviceId: "mehndi-08",
    name: "Arabic Bridal Mehndi",
    description: "A bridal henna experience featuring bold Arabic-inspired patterns.",
    category: "Mehndi Care",
    price: 4499,
    duration: "3 hours",
    image: pexels(4723603),
    rating: 4.9,
  },
  {
    serviceId: "mehndi-09",
    name: "Feet Mehndi Design",
    description: "Beautiful decorative henna artistry for feet and ankles.",
    category: "Mehndi Care",
    price: 2499,
    duration: "90 min",
    image: pexels(18380548),
    rating: 4.8,
  },
  {
    serviceId: "mehndi-10",
    name: "Premium Full Bridal Mehndi",
    description: "An elaborate bridal henna experience with detailed patterns and artistic finishing.",
    category: "Mehndi Care",
    price: 8999,
    duration: "6 hours",
    image: pexels(36581308),
    rating: 5.0,
  },
];

// =====================================================
// SEED SERVICES
// =====================================================

const seedServices = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in backend .env"
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully ❤️");

    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const item of services) {
      try {
        const existing = await Service.findOne({
          serviceId: item.serviceId,
        });

        if (existing) {
          await Service.updateOne(
            { _id: existing._id },
            {
              $set: {
                ...item,
                isActive: true,
              },
            },
            {
              runValidators: true,
            }
          );

          updated++;

          console.log(
            `UPDATED: ${item.serviceId} — ${item.name}`
          );
        } else {
          await Service.create({
            ...item,
            isActive: true,
          });

          created++;

          console.log(
            `CREATED: ${item.serviceId} — ${item.name}`
          );
        }
      } catch (error) {
        failed++;

        console.error(
          `FAILED: ${item.serviceId}`,
          error.message
        );
      }
    }

    // =================================================
    // FINAL DATABASE SUMMARY
    // =================================================

    const [skinCount, bridalCount, mehndiCount, total] =
      await Promise.all([
        Service.countDocuments({
          category: "Skin Care",
          isActive: true,
        }),

        Service.countDocuments({
          category: "Bridal Care",
          isActive: true,
        }),

        Service.countDocuments({
          category: "Mehndi Care",
          isActive: true,
        }),

        Service.countDocuments({
          isActive: true,
        }),
      ]);

    const missingImages = await Service.countDocuments({
      isActive: true,
      $or: [
        { image: "" },
        { image: null },
        { image: { $exists: false } },
      ],
    });

    console.log("\n");
    console.log("======================================");
    console.log("       GLOWAURA SERVICE SEED ❤️");
    console.log("======================================");
    console.log("Seed records:", services.length);
    console.log("Created:", created);
    console.log("Updated:", updated);
    console.log("Failed:", failed);
    console.log("--------------------------------------");
    console.log("Skin Care:", skinCount);
    console.log("Bridal Care:", bridalCount);
    console.log("Mehndi Care:", mehndiCount);
    console.log("Total active services:", total);
    console.log("Active services without images:", missingImages);
    console.log("======================================");

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(
      "GLOWAURA SERVICE SEED ERROR:",
      error
    );

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("MongoDB disconnected.");
    }
  }
};

// =====================================================
// RUN
// =====================================================

seedServices();
