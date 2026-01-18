const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDb = require("./config/dbConnection");

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users",require("./routes/userRoute"))

app.use(errorHandler);

connectDb()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(port, () => {
      console.log("Server Running on port " + port);
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.log(err);
  });
