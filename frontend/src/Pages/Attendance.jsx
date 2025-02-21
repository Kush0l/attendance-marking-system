import { useEffect, useState } from "react";
import { bulkAttendance } from "../api";

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDate, setBulkDate] = useState("");
  const [bulkAttendanceData, setBulkAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await bulkAttendance(token);
        const groupedData = groupAttendanceByEmployee(response.data.data);
        setAttendanceData(groupedData);

        if (Object.keys(groupedData).length > 0) {
          setSelectedEmployee(Object.keys(groupedData)[0]);
        }
      } catch (err) {
        setError("Failed to fetch attendance records : LogIn as Admin");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);
  
  useEffect(() => {
    filterBulkAttendance();
  }, [bulkDate, attendanceData]);

  const filterBulkAttendance = () => {
    if (!bulkDate) {
      setBulkAttendanceData([]);
      return;
    }

    const selectedDate = new Date(bulkDate);
    const bulkData = [];

    Object.values(attendanceData).forEach(employee => {
      const attendance = employee.records.find(record => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === selectedDate.toDateString();
      });

      if (attendance) {
        bulkData.push({
          name: employee.name,
          email: employee.email,
          date: attendance.date,
          checkInTime: attendance.checkInTime,
          status: attendance.status
        });
      }
    });

    setBulkAttendanceData(bulkData);
  };

  const groupAttendanceByEmployee = (data) => {
    const grouped = {};
    data.forEach((employee) => {
      const key = employee.employeeEmail;
      if (!grouped[key]) {
        grouped[key] = {
          name: employee.employeeName,
          email: employee.employeeEmail,
          records: employee.attendance || [],
        };
      }
    });
    return grouped;
  };

  const downloadBulkCSV = () => {
    if (bulkAttendanceData.length === 0) return;

    const headers = ["Name", "Email", "Date", "Check-in Time", "Status"];
    const rows = bulkAttendanceData.map(record => [
      record.name,
      record.email,
      new Date(record.date).toDateString(),
      record.checkInTime,
      record.status
    ]);

    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bulk_Attendance_${bulkDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadIndividualCSV = () => {
    if (!selectedEmployee || !attendanceData[selectedEmployee]) return;

    const headers = ["Date", "Check-in Time", "Status"];
    const rows = attendanceData[selectedEmployee].records.map(record => [
      new Date(record.date).toDateString(),
      record.checkInTime,
      record.status
    ]);

    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${attendanceData[selectedEmployee].name}_Attendance.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Individual Employee Attendance Section */}
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Individual Employee Attendance
          </h2>

          <select
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedEmployee || ""}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select Employee</option>
            {Object.values(attendanceData).map((employee) => (
              <option key={employee.email} value={employee.email}>
                {employee.name} ({employee.email})
              </option>
            ))}
          </select>

          {selectedEmployee && attendanceData[selectedEmployee] && (
            <div className="bg-white shadow-md rounded-lg dark:bg-gray-700">
              <h3 className="text-xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-4">
                {attendanceData[selectedEmployee].name} ({attendanceData[selectedEmployee].email})
              </h3>

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
                    {attendanceData[selectedEmployee].records.map((record, i) => (
                      <tr key={i} className="text-center">
                        <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                          {new Date(record.date).toDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                          {record.checkInTime}
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

              <button
                onClick={downloadIndividualCSV}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Download CSV
              </button>
            </div>
          )}
        </div>

        {/* Bulk Attendance Section */}
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Bulk Attendance Download
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={bulkDate}
              onChange={(e) => setBulkDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {bulkAttendanceData.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg dark:bg-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-800">
                      <th className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                        Email
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
                    {bulkAttendanceData.map((record, i) => (
                      <tr key={i} className="text-center">
                        <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                          {record.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                          {record.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                          {record.checkInTime}
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

              <button
                onClick={downloadBulkCSV}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Download Bulk Attendance CSV
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {bulkDate ? "No attendance records found for selected date" : "Select a date to view attendance"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AttendanceTable;