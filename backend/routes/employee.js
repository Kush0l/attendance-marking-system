const { Router } = require("express");
const {employeeModel, attendanceModel} = require("../db")
const jwt = require("jsonwebtoken")
const {JWT_employee_PASSWORD} = require("../config")
const {employeeMiddleware} = require("../middleware/employee")
const { z } = require("zod");
const { networkInterfaces } = require("os");



// todo: hashing, 


const employeeRouter = Router();

// Zod schemas for validation
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


employeeRouter.post('/signin', async (req, res) => {

  const validation = signinSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid input", errors: validation.error.errors });
  }

  const {email, password} = req.body;

  const employee = await employeeModel.findOne({
    email : email,
    password : password
  })
  
  
  if(employee){
    const token = jwt.sign({
      id: employee._id
    }, JWT_employee_PASSWORD);

    res.json({
      token: token
    })
  }else{
    res.status(403).json({
      message:"Incorrect credentials"
    })
  }
})


employeeRouter.post("/checkin", employeeMiddleware, async (req, res) => {

  const {empIP} = req.body;

  const allowedIpPrefix = "192.168.29";

  const nets = networkInterfaces();
  let wifiIP = '';

  for (const name of Object.keys(nets)) {
    if (name === 'Wi-Fi') { // Only pick "Wi-Fi" interface
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          wifiIP = net.address;
          break; // Stop after the first valid IP
        }
      }
    }
  }

  // Extract first 3 octets (e.g., "192.168.29")
  const clientIpPrefix = wifiIP ? wifiIP.split('.').slice(0, 3).join('.') : '';

  // use below to know ip 
  // console.log(clientIpPrefix);
  
  if (!clientIpPrefix) {
    return res.status(500).json({ message: "Wi-Fi network not detected. Please check your connection." });
  }

  if (clientIpPrefix !== allowedIpPrefix) {
      return res.status(403).json({ message: "Check-in not allowed from this network." });
  }

  try {
      const employeeId = req.employeeId;
      const today = new Date().setHours(0, 0, 0, 0);

      const existingCheckin = await attendanceModel.findOne({ employeeId, date: today });

      if (existingCheckin) {
          return res.status(400).json({ message: "Already checked in today." });
      }

      await attendanceModel.create({
          employeeId,
          date: today,
          checkInTime: new Date(),
          status: "Present",
      });

      return res.json({ message: "Check-in successful" });
  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ message: "Server error", error: error.message || error });
}

});



// employeeRouter.get('/attendance', employeeMiddleware, async (req, res) => {
//   try {
//     const employeeId = req.employeeId;

//     // Fetch attendance records and populate employee details
//     const attendanceRecords = await attendanceModel
//       .find({ employeeId })
//       .populate("employeeId", "firstName lastName"); // Fetch only the firstName and lastName

//     res.json({ success: true, data: attendanceRecords });
//   } catch (error) {
//     console.error("Attendance Fetch Error:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// });

employeeRouter.get('/attendance', employeeMiddleware, async (req, res) => {
  try {
    const employeeId = req.employeeId; // Extract employee ID from token

    const attendanceRecords = await attendanceModel
      .find({ employeeId })
      .populate("employeeId", "firstName lastName email"); // Fetch only necessary fields

    res.json({ success: true, data: attendanceRecords });
  } catch (error) {
    console.error("Attendance Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});








module.exports = {
employeeRouter : employeeRouter
}