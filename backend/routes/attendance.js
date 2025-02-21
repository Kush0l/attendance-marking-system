

const express = require("express");
// const Attendance = require("../models/attendanceModel");
const {employeeModel, attendanceModel} = require("../db")
const adminRouter = Router();
const {adminMiddleware}= require("../middleware/admin")




// adminRouter.get("/attendance",  async (req, res) => {
//   try {
//     const attendanceRecords = await attendanceModel.find()
//       .populate("employeeId", "firstName lastName email") // Fetch employee details
//       .lean(); // Convert to plain JavaScript object

//     res.json({
//       success: true,
//       data: attendanceRecords.map(record => ({
//         employeeName: `${record.employeeId.firstName} ${record.employeeId.lastName}`,
//         employeeEmail: record.employeeId.email,
//         date: record.date.toDateString(),
//         checkInTime: record.checkInTime ? record.checkInTime.toLocaleTimeString() : "Not Checked In",
//         status: record.status
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// });




