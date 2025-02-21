const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
 
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const employeeSchema = new Schema({
    firstName:String,
    lastName:String,
    password:String,
    email: {
        type: String,
        unique: true
    }
})

const adminSchema = new Schema({
    firstName:String,
    lastName:String,
    password:String,
    email: {
      type: String,
      unique: true
    }
})


const attendanceSchema = new mongoose.Schema({
    employeeId: { type: ObjectId, ref: "employees" },
    date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
    checkInTime: { type: Date, default: null },
    status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
  });
  


const employeeModel = mongoose.model('employees', employeeSchema);
const adminModel = mongoose.model('admins', adminSchema);
const attendanceModel = mongoose.model('attendences', attendanceSchema)
   
module.exports={
    employeeModel,
    adminModel,
    attendanceModel
}