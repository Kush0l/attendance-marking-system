const cron = require("node-cron");
const mongoose = require("mongoose");
const {employeeModel, attendanceModel} = require("./db")


require("dotenv").config();

// Connect to MongoDB if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI);
}

// Schedule job to run at midnight (00:00) daily
cron.schedule("55 23 * * *", async () => {
  console.log("Running attendance cron job...");

  const today = new Date().setHours(0, 0, 0, 0); // Store only the date

  try {
    const employees = await employeeModel.find();

    for (const emp of employees) {
      // Check if employee already has an attendance record for today
      const existingRecord = await attendanceModel.findOne({ employeeId: emp._id, date: today });

      if (!existingRecord) {
        // Mark employee as Absent
        await attendanceModel.create({
          employeeId: emp._id,
          date: today,
          status: "Absent",
          checkInTime: null,
        });
      }
    }

    console.log("Absent employees marked successfully.");
  } catch (error) {
    console.error("Error in attendance cron job:", error);
  }
});
