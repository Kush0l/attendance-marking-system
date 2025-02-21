require("dotenv").config();
require("./cron");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 



const app = express();

const { adminRouter } = require("./routes/admin");
const { employeeRouter } = require("./routes/employee");

app.use(
  cors({
    // origin: "http://localhost:5173", // Allow frontend
    origin: ["http://localhost:5173", "http://localhost:3001","http://127.0.0.1:3001"],
    credentials: true,
  })
);



app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/employee", employeeRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  app.listen(3000, () => console.log("Server running on port 3000 🚀"));
}

main();
