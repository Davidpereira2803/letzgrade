import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
    <nav className="bg-[#DFDFDF] text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">LetzGrade</Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-600 font-bold">Home</Link>
          <Link to="/about" className="hover:text-gray-600 font-bold">About Us</Link>
          <Link to="/contact" className="hover:text-gray-600 font-bold">Contact</Link>
        </div>

        <div className="space-x-6">
            <Link onClick={() => setIsLoginOpen(true)}>
              Log in
            </Link>
            <Link onClick={() => setIsSignupOpen(true)}>
              <Button text="Sign Up" className="hover:bg-[#CA4B4B]" />
            </Link>
        </div>
      </div>
    </nav>

    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
};

export default Navbar;
