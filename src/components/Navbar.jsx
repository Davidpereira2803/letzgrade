import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, Languages, X } from "lucide-react";
import Button from "./Button";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import GetStartedModal from "./GetStartedModal";
import { monitorAuthState, logout } from "../services/firebase";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    monitorAuthState(setUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-[#DFDFDF] text-black p-4 relative">
        <div className="container mx-auto flex items-center justify-between">
          
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:left-0 lg:transform-none">
            <Link to="/" className="text-2xl font-bold">
              LetzGrade
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-600 font-bold">{t("home")}</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-600 font-bold">{t("dashboard")}</Link>
                <Link to="/addStudyProgram" className="hover:text-gray-600 font-bold">{t("addStudyProgram")}</Link>
                <Link to="/profile" className="hover:text-gray-600 font-bold">{t("profile")}</Link>
              </>
            ) : (
              <>
                <Link to="/about" className="hover:text-gray-600 font-bold">{t("aboutUs")}</Link>
                <Link to="/contact" className="hover:text-gray-600 font-bold">{t("contact")}</Link>
              </>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                >
                  {t("logout")}
                </button>

                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button 
                    className="text-black flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Languages size={20} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border shadow-lg rounded w-40 z-50">
                      <button className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={() => changeLanguage("en")}>
                        🇬🇧 English
                      </button>
                      <button className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={() => changeLanguage("fr")}>
                        🇫🇷 Français
                      </button>
                      <button className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={() => changeLanguage("de")}>
                        🇩🇪 Deutsch
                      </button>
                      <button className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={() => changeLanguage("lux")}>
                        🇱🇺 Lëtzebuergesch
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <span 
                  onClick={() => setIsLoginOpen(true)} 
                  className="hover:text-gray-600 cursor-pointer"
                >
                  {t("login")}
                </span>
                
                <Button 
                  text={t("signup")} 
                  className="hover:bg-[#CA4B4B] text-sm" 
                  onClick={() => setIsSignupOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-[#DFDFDF] shadow-lg rounded p-4 mt-2 absolute left-0 right-0 z-50">
            {user ? (
              <>
                <Link to="/" className="block py-2 hover:text-gray-600 font-bold">{t("home")}</Link>
                <Link to="/dashboard" className="block py-2 hover:text-gray-600 font-bold">{t("dashboard")}</Link>
                <Link to="/addStudyProgram" className="block py-2 hover:text-gray-600 font-bold">{t("addStudyProgram")}</Link>
                <Link to="/profile" className="block py-2 hover:text-gray-600 font-bold">{t("profile")}</Link>
                
                <div className="py-2 border-t mt-2 pt-4">
                  <p className="text-gray-600 mb-2">{t("language")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      className="px-3 py-2 text-sm hover:bg-gray-200 text-left rounded border"
                      onClick={() => changeLanguage("en")}>
                      🇬🇧 English
                    </button>
                    <button 
                      className="px-3 py-2 text-sm hover:bg-gray-200 text-left rounded border"
                      onClick={() => changeLanguage("fr")}>
                      🇫🇷 Français
                    </button>
                    <button 
                      className="px-3 py-2 text-sm hover:bg-gray-200 text-left rounded border"
                      onClick={() => changeLanguage("de")}>
                      🇩🇪 Deutsch
                    </button>
                    <button 
                      className="px-3 py-2 text-sm hover:bg-gray-200 text-left rounded border"
                      onClick={() => changeLanguage("lux")}>
                      🇱🇺 Lëtzebuergesch
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="block py-2 hover:text-gray-600 font-bold">{t("home")}</Link>
                <Link to="/about" className="block py-2 hover:text-gray-600 font-bold">{t("aboutUs")}</Link>
                <Link to="/contact" className="block py-2 hover:text-gray-600 font-bold">{t("contact")}</Link>
                <div className="flex flex-col space-y-2 mt-4">
                  <span 
                    onClick={() => setIsLoginOpen(true)} 
                    className="py-2 text-center cursor-pointer hover:text-gray-600"
                  >
                    {t("login")}
                  </span>
                  
                  <Button 
                    text={t("signup")} 
                    className="hover:bg-[#CA4B4B] text-sm w-full" 
                    onClick={() => setIsSignupOpen(true)}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {isLoginOpen && <LoginModal setIsOpen={setIsLoginOpen} />}
      {isSignupOpen && <SignupModal setIsOpen={setIsSignupOpen} />}
      {isGetStartedOpen && <GetStartedModal setIsOpen={setIsGetStartedOpen} />}
    </>
  );
};

export default Navbar;