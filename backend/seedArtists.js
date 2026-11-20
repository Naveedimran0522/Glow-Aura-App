
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — DEMO ARTISTS SEED */



const dns = require("dns");
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const artistNames = [
  "Sara Beauty Studio",
  "Ayesha Khan",
  "Mehak Fatima",
  "Maryam Khan",
  "Saba Parveen",
  "Neha Mishra",
  "Ananya Reddy",
  "Pooja Verma",
  "Rida Fatima",
  "Nisha Kumari",
  "Meera Artistry",
  "Noor Jahan",
  "Kavya Rao",
  "Farah Begum",
  "Shreya Kapoor",
  "Divya Rani",
  "Sneha Patel",
  "Amina Sheikh",
  "Hiba Noor",
  "Sana Shaikh",
  "Alina Parveen",
  "Areeba Noor",
  "Sadia Khan",
];

const createDemoArtists = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    let created = 0;
    let alreadyExists = 0;

    for (const name of artistNames) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "");

      const email = `${slug}@glowaura.test`;

      const existingArtist = await User.findOne({ email });

      if (existingArtist) {
        if (existingArtist.role !== "artist") {
          console.log(`Skipped existing non-artist: ${email}`);
          alreadyExists++;
          continue;
        }

        console.log(`Already exists: ${name}`);
        alreadyExists++;
        continue;
      }

      await User.create({
        name,
        email,
        phone: "",
        role: "artist",
        isVerified: false,
      });

      console.log(`Created artist: ${name}`);
      created++;
    }

    console.log("\n========== SEED SUMMARY ==========");
    console.log("Total names:", artistNames.length);
    console.log("Created:", created);
    console.log("Already exists / skipped:", alreadyExists);
    console.log("=================================");

  } catch (error) {
    console.error("ARTIST SEED ERROR:", error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createDemoArtists();
