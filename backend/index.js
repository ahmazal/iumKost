const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const penghuniRoutes = require("./routes/penghuni");
const tagihanRoutes = require("./routes/tagihan");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/penghuni", penghuniRoutes);
app.use("/tagihan", tagihanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));