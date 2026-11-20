/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — DEFAULT SERVICES SEEDER */

require("dotenv").config();
const dns = require("node:dns/promises")

const mongoose = require("mongoose");
const Service = require("../models/Service");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const services = [
  {
    serviceId: "skin-01",
    name: "Radiance Glow Facial",
    description: "Premium facial treatment for radiant and glowing skin.",
    category: "Skin Care",
    price: 1499,
    duration: "60 minutes",
    isActive: true,
  },
  {
    serviceId: "skin-02",
    name: "Hydra Care Facial",
    description: "Deep hydration facial for soft, healthy and refreshed skin.",
    category: "Skin Care",
    price: 1999,
    duration: "75 minutes",
    isActive: true,
  },
  {
    serviceId: "bridal-01",
    name: "Bridal Glow Package",
    description: "Complete premium bridal beauty and skincare package.",
    category: "Bridal Care",
    price: 7999,
    duration: "3 hours",
    isActive: true,
  },
  {
    serviceId: "bridal-02",
    name: "Engagement Makeup",
    description: "Elegant professional makeup for engagement occasions.",
    category: "Bridal Care",
    price: 4999,
    duration: "2 hours",
    isActive: true,
  },
  {
    serviceId: "mehndi-01",
    name: "Bridal Mehndi Design",
    description: "Beautiful detailed bridal mehndi and henna artistry.",
    category: "Mehndi Care",
    price: 5999,
    duration: "4 hours",
    isActive: true,
  },
];

const seedServices = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error(
        "MongoDB connection URL missing. Check your backend .env."
      );
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully ❤️");

    for (const service of services) {
      await Service.updateOne(
        { serviceId: service.serviceId },
        { $setOnInsert: service },
        { upsert: true }
      );

      console.log(`Checked: ${service.name}`);
    }

    console.log("\n❤️ GlowAura default services seeded successfully!");
    console.log("Total default services:", services.length);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("SERVICE SEED ERROR:", error.message);

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seedServices();