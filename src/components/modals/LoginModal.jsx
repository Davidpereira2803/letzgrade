import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../services/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(t("enterEmailForReset"));
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage(t("resetEmailSent"));
      setError("");
    } catch (err) {
      setError(t("resetEmailError"));
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
          className="absolute top-2 right-2 text-[#CA4B4B] hover:text-[#CA4B4B] text-xl"
          onClick={onClose}
        >
          <X size={24} strokeWidth={4} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{t("login")}</h2>
        {resetMessage && <p className="text-green-500 text-center">{resetMessage}</p>}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("email")}
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
              {t("password")}
            </label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              placeholder={t("enterPassword")}
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
            onClick={handleForgotPassword}
          >
            {t("forgotPassword")}
          </button>

          <button 
            type="submit"
            className="w-full bg-[#C0C0C0] hover:bg-[#CA4B4B] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {t("logIn")}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-3">
          <button 
            onClick={handleGoogleSignIn} 
            className="w-full flex items-center justify-center gap-3 bg-[#C0C0C0] hover:bg-[#CA4B4B] text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >

            <FcGoogle className="w-6 h-6" />
            {t("signInWithGoogle")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
