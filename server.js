const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require('path');
const rateLimit = require("express-rate-limit");

const connectDb = require("./config/dbConnection");

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2,
  message: "Too many requests, try again later",
});

app.use("/api", limiter);

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users",require("./routes/userRoute"))
// file upload route
app.use('/api/upload', require('./routes/fileRoutes'));
// Basic health endpoint (useful for dev & proxies)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server immediately so the frontend dev server can proxy requests even if DB is down.
app.listen(port, () => {
  console.log('Server Running on port ' + port);
});

// Connect to database in background. If it fails, server still runs (useful for frontend dev).
connectDb()
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch((err) => {
    console.log('Database Connection Failed');
    console.log(err);
  });
