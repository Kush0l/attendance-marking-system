import axios from "axios";

const API_URL = import.meta.env.VITE_ADMIN_API_URL;
// const API_URL = `${window.location.origin}/api/v1`;


export const adminSignup = (data) => axios.post(`${API_URL}/admin/signup`, data);
export const adminSignin = (data) => axios.post(`${API_URL}/admin/signin`, data);
export const employeeSignin = (data) => axios.post(`${API_URL}/employee/signin`, data);
export const createEmployee = (data, token) =>
  axios.post(`${API_URL}/admin/createEmployee`, data, {
    headers: { 
      "Authorization": `Bearer ${token}`, // ✅ Correct token format
      "Content-Type": "application/json" // ✅ Explicit content type
    },
  });


export const employeeCheckin = (data, token) => axios.post(`${API_URL}/employee/checkin`, data, {
  headers: { 
    "Authorization": `Bearer ${token}`, // ✅ Correct token format
    "Content-Type": "application/json" // ✅ Explicit content type
  },
});

export const bulkAttendance = (token) => axios.get(`${API_URL}/admin/attendance`, {
  headers: { 
    "Authorization": `Bearer ${token}`, // ✅ Correct token format
    "Content-Type": "application/json" // ✅ Explicit content type
  },
});

export const employeeAttendance = (token) => axios.get(`${API_URL}/employee/attendance`, {
  headers: { 
    "Authorization": `Bearer ${token}`, // ✅ Correct token format
    "Content-Type": "application/json" // ✅ Explicit content type
  },
});

