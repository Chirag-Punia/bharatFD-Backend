const express = require("express");
const mongoose = require("mongoose");
const Redis = require("redis");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const faqs = require("./routes/faqs");
const languages = require("./routes/languages");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use("/api/faqs", faqs);
app.use("/api/languages", languages);
app.use("/api/auth", authRoutes);
app.use("/api/faqs", auth);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5003;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
