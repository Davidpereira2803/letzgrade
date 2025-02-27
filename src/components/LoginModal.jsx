import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth} from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

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

        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 top-1/3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="button"
            className="text-[#C0C0C0] hover:underline text-sm mb-3 block"
            onClick={() => alert("Forgot password?")}
          >
            Forgot Password?
          </button>

          <button 
            type="submit"
            className="w-full bg-[#C0C0C0] hover:bg-[#CA4B4B] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
