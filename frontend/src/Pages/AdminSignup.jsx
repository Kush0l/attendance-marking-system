import React, { useState } from "react";
import { adminSignup } from "../api";
import logo from "../assets/images/liqwayimage.png";
import HomeAvatar from "../assets/images/Linqimg-removebg-preview.png";
import AdminSignUpForm from "../components/AdminSignUpForm";

const AdminSignup = () => {
  return (
    <>
      <AdminSignUpForm />
    </>
  );
};

export default AdminSignup;
