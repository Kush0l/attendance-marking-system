require("dotenv").config();

// const JWT_employee_PASSWORD ="employeePassword"
// const JWT_ADMIN_PASSWORD ="adminPassword"

const JWT_employee_PASSWORD = process.env.JWT_EMPLOYEE_PASSWORD
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD

module.exports = {
  JWT_employee_PASSWORD : JWT_employee_PASSWORD,
  JWT_ADMIN_PASSWORD : JWT_ADMIN_PASSWORD
}