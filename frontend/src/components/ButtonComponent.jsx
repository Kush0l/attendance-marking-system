const ButtonComponent = ({ label, url }) => {
  return (
    <button
      onClick={() => (window.location.href = url)}
      className="px-6 py-3 text-lg font-semibold text-gray-800 bg-white border-2 border-gray-800 rounded-md shadow-md hover:bg-gray-100 transition duration-200 sketch-button"
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
