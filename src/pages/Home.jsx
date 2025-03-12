import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import GetStartedModal from "../components/GetStartedModal";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const Home = () => {
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [nextModal, setNextModal] = useState(null);

  useEffect(() => {
    if (!isGetStartedOpen && nextModal) {
      if (nextModal === "login") setIsLoginOpen(true);
      if (nextModal === "signup") setIsSignupOpen(true);
      setNextModal(null);
    }
  }, [isGetStartedOpen]);

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center flex-grow">
      <div className="text-white text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to LetzGrade</h1>
        <p className="text-lg mb-6">Track your grades efficiently.</p>

        <Button
          text="🚀 Get Started"
          onClick={() => setIsGetStartedOpen(true)}
          className="bg-[#C0C0C0] bg-opacity-50 hover:bg-[#CA4B4B] text-white px-6 py-3 rounded-lg transition duration-300"
          
        />
      </div>

      <GetStartedModal 
        isOpen={isGetStartedOpen} 
        onClose={() => setIsGetStartedOpen(false)}
        onLoginOpen={() => setNextModal("login")}
        onSignUpOpen={() => setNextModal("signup")}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  );
};

export default Home;
