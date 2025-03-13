import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings } from "lucide-react";
import Button from "./Button";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import GetStartedModal from "./GetStartedModal";
import { auth, monitorAuthState, logout} from "../services/firebase";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    monitorAuthState(setUser);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
    <nav className="bg-[#DFDFDF] text-black p-4" style={{ backgroundColor: "rgba(211, 211, 211, 0.9)" }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">LetzGrade</Link>

        <div className="hidden md:flex space-x-6">
          {user ? (
            <>
              <Link to="/" className="hover:text-gray-600 font-bold">Home</Link>
              <Link to="/dashboard" className="hover:text-gray-600 font-bold">Dashboard</Link>
              <Link to="/addStudyProgram" className="hover:text-gray-600 font-bold">Add Study Program</Link>
            </>
          ):(
            <>
              <Link to="/" className="hover:text-gray-600 font-bold">Home</Link>
              <Link to="/about" className="hover:text-gray-600 font-bold">About Us</Link>
              <Link to="/contact" className="hover:text-gray-600 font-bold">Contact</Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">
                Welcome <span className="font-bold">{user.displayName || user.email}</span>
              </span>

              <Link to="/profile" className="hover:text-gray-600 flex items-center">
                <User size={24} />
              </Link>

              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setIsLoginOpen(true)}>
                Log in
              </Link>
              <Link onClick={() => setIsSignupOpen(true)}>
                <Button text="Sign Up" className="hover:bg-[#CA4B4B]" />
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>

    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    <GetStartedModal 
      isOpen={isGetStartedOpen} 
      onClose={() => setIsGetStartedOpen(false)} 
      onLoginOpen={() => setIsLoginOpen(true)}
      onSignUpOpen={() => setIsSignupOpen(true)}
    />
    </>
  );
};

export default Navbar;
