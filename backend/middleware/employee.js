const jwt = require("jsonwebtoken");
const { JWT_employee_PASSWORD } = require("../config");

const employeeMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: "JWT token missing in Authorization header" });
    }

    try {
        const decoded = jwt.verify(token, JWT_employee_PASSWORD);
        req.employeeId = decoded.id;  // Correcting employee ID assignment
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = { employeeMiddleware };
