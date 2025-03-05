const GetStartedModal = ({ isOpen, onClose, onLoginOpen, onSignUpOpen }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Get Started</h2>
        <p className="text-center text-gray-600 mb-6">
          Create an account or log in to track your grades efficiently.
        </p>

        <button 
          onClick={() => {
            onClose();
            setTimeout(onSignUpOpen, 500); // ✅ Ensure Firebase updates before switching modal
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mb-3"
        >
          Sign Up
        </button>

        <button 
          onClick={() => {
            onClose();
            onLoginOpen();
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default GetStartedModal;
