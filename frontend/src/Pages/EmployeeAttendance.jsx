import { useEffect, useState } from "react";
import { employeeAttendance } from "../api";
import { jwtDecode } from "jwt-decode";

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        const employeeId = decodedToken.id;

        const response = await employeeAttendance(token);
        const filteredAttendance = response.data.data.filter(
          (record) => record.employeeId._id === employeeId
        );

        setEmployee(response.data.data[0]?.employeeId);
        setAttendanceData(filteredAttendance);
      } catch (err) {
        setError("Failed to fetch attendance records.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const downloadCSV = () => {
    if (attendanceData.length === 0) return;

    const headers = ["Date", "Check-in Time", "Status"];
    const rows = attendanceData.map((record) => [
      new Date(record.date).toDateString(),
      record.status === "Absent" || !record.checkInTime
        ? "Not Checked In"
        : new Date(record.checkInTime).toLocaleTimeString(),
      record.status,
    ]);

    const csvContent = [
      headers.join(","), 
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee?.firstName || "Employee"}_Attendance.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Your Attendance
        </h2>

        {employee && (
          <h3 className="text-xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-4">
            {employee.firstName} {employee.lastName} ({employee.email})
          </h3>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                  Check-in Time
                </th>
                <th className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, i) => (
                <tr key={i} className="text-center">
                  <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                    {new Date(record.date).toDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                    {record.status === "Absent" || !record.checkInTime
                      ? "Not Checked In"
                      : new Date(record.checkInTime).toLocaleTimeString()}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-semibold ${
                      record.status === "Present"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Download CSV Button */}
        <button
          onClick={downloadCSV}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Download Attendance
        </button>
      </div>
    </section>
  );
};

export default AttendanceTable;
