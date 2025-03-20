import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { auth, googleProvider,db } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup  } from "firebase/auth";
import { doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";

const SignupModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      setError(t("userIdNotAvailable"))
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await new Promise(resolve => setTimeout(resolve, 500));

      const user = userCredential.user;
      if (!user) {
        setError("User ID not available after sign-up. Please try again.");
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email,
      });
      

      await updateProfile(user, {
        displayName: name,
      });

      navigate("/dashboard");

      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName,
        email: user.email,
      });

      navigate("/dashboard");
      onClose();
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
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
          className="absolute top-2 right-2 text-[#CA4B4B] hover:text-[#CA4B4B]  text-xl"
          onClick={onClose}
        >
          <X size={24} strokeWidth={4} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{t("signUp")}</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("fullName")}
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={t("enterFullName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("email")}
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={t("enterEmail")}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12" 
              placeholder={t("enterPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("confirmPassword")}
            </label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12" 
              placeholder={t("confirmYourPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#C0C0C0] hover:bg-[#CA4B4B] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {t("signUp")}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-3">
          <button 
            onClick={handleGoogleSignUp} 
            className="w-full flex items-center justify-center gap-3 bg-[#C0C0C0] hover:bg-[#CA4B4B] text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            <FcGoogle className="w-6 h-6" />
            {t("signUpWithGoogle")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SignupModal;
