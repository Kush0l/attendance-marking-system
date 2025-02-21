import ButtonComponent from "../components/ButtonComponent";

const EmployeeNavigation = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen space-x-6">
      <ButtonComponent label="Check In" url={`checkin`} />
      <ButtonComponent label="My Attendance" url={`attendance`} />
    </div>
  );
};

export default EmployeeNavigation;
