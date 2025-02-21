import ButtonComponent from "../components/ButtonComponent";

const AdminNavigation = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen space-x-6">
      <ButtonComponent label="Create Employee" url={`create-employee`} />
      <ButtonComponent label="Employees Attendance" url={`attendance`} />
    </div>
  );
};

export default AdminNavigation;
