import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import AdminSignup from "./Pages/AdminSignup";
import AdminSignin from "./Pages/AdminSignin";
import EmployeeSignin from "./Pages/EmployeeSignin";
import CreateEmployee from "./Pages/CreateEmployee";
import CheckIn from "./Pages/CheckIn";
import AttendanceTable from "./Pages/Attendance";
import EmployeeAttendance from "./Pages/EmployeeAttendance";
import EmployeeNavigation from "./Pages/EmployeeNavigation";
import AdminNavigation from "./Pages/AdminNavigation";

// Import different Navbar and Footer components
import DefaultNavbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import EmployeeNavbar from "./components/EmployeeNavbar";
import DefaultFooter from "./components/Footer";


const Layout = ({ children }) => {
  const location = useLocation();

  let NavbarComponent = DefaultNavbar;
  let FooterComponent = DefaultFooter;

  // Conditionally set Navbar and Footer based on the route
  if (location.pathname.startsWith("/admin")) {
    NavbarComponent = AdminNavbar;
    FooterComponent = DefaultFooter;
  } else if (location.pathname.startsWith("/employee")) {
    NavbarComponent = EmployeeNavbar;
    FooterComponent = DefaultFooter;
  }

  return (
    <>
      <NavbarComponent />
      {children}
      <FooterComponent />
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/signin" element={<AdminSignin />} />
          <Route path="/employee/signin" element={<EmployeeSignin />} />
          <Route path="/admin/create-employee" element={<CreateEmployee />} />
          <Route path="/employee/checkin" element={<CheckIn />} />
          <Route path="/employee/attendance" element={<EmployeeAttendance />} />
          <Route path="/admin/attendance" element={<AttendanceTable />} />
          <Route path="/employee/navigate" element={<EmployeeNavigation />} />
          <Route path="/admin/navigate" element={<AdminNavigation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
