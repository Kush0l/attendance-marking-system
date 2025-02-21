import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignin } from "../api";
import AdminSignInForm from "../components/AdminSignInForm";

const AdminSignin = () => {


  return (
    <>
      <AdminSignInForm />
    </>
  );
};

export default AdminSignin;
