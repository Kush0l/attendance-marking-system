const { Router } = require("express");

const adminRouter = Router();

const {adminModel, employeeModel, attendanceModel} = require("../db");

const jwt = require("jsonwebtoken");

const {JWT_ADMIN_PASSWORD} = require("../config");

const {adminMiddleware}= require("../middleware/admin")


const { z } = require("zod");


const bcrypt = require("bcrypt");


// Zod schemas for validation
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

adminRouter.post("/signup", async function (req, res) {
  const validation = signinSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid input", errors: validation.error.errors });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      email,
      password: hashedPassword,  // ✅ Store hashed password
      firstName,
      lastName
    });

    res.json({ message: "Signup success" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





// adminRouter.post("/signin", async function (req, res) {
//   const {email, password} = req.body;

//   const admin = await adminModel.findOne({
//     email : email,
//     password : password
//   })
  
  
//   if(admin){
//    const token = jwt.sign({
//       id: admin._id
//     }, JWT_ADMIN_PASSWORD);

//     res.json({
//       token: token
//     })
//   }else{
//     res.status(403).json({
//       message:"Incorrect credentials"
//     })
//   }
// });

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email });

  if (!admin) {
    return res.status(403).json({ message: "Incorrect credentials" });
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(403).json({ message: "Incorrect credentials" });
  }

  const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD, { expiresIn: "1h" });

  res.json({ token });
});




// adminRouter.post('/createEmployee', adminMiddleware, async function (req, res) {

//   const {email, password, firstName, lastName} = req.body

//   await employeeModel.create({
//     email : email,
//     password : password,
//     firstName : firstName,
//     lastName : lastName
//   })


//   res.json({
//     message:"employee creation successfull"
//   })

 
// })

adminRouter.post('/createEmployee', adminMiddleware, async function (req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if employee already exists
    const existingEmployee = await employeeModel.findOne({ email: email });

    if (existingEmployee) {
      
      return res.status(400).json({ message: "Employee already exists with this email" });
    }

    // Create new employee
    await employeeModel.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    });

    res.json({ message: "Employee creation successful" });

  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


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
//     console.error("Error fetching attendance:", error);  // ✅ Log error
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// });



adminRouter.get("/attendance", adminMiddleware, async (req, res) => {
  try {
    const attendanceRecords = await attendanceModel.find()
      .populate("employeeId", "firstName lastName email") // Fetch employee details
      .lean(); // Convert to plain JavaScript object

    // Group records by employee
    const groupedAttendance = attendanceRecords.reduce((acc, record) => {
      const employeeKey = record.employeeId._id.toString(); // Unique identifier

      if (!acc[employeeKey]) {
        acc[employeeKey] = {
          employeeName: `${record.employeeId.firstName} ${record.employeeId.lastName}`,
          employeeEmail: record.employeeId.email,
          attendance: [] // Store attendance records
        };
      }

      acc[employeeKey].attendance.push({
        date: record.date.toDateString(),
        checkInTime: record.checkInTime ? record.checkInTime.toLocaleTimeString() : "Not Checked In",
        status: record.status
      });

      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(groupedAttendance) // Convert grouped object to an array
    });

  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


module.exports = {
  adminRouter: adminRouter,
};


