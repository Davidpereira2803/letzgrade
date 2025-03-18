import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X, Languages, LogOut } from "lucide-react";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";
import { monitorAuthState, logout } from "../services/firebase";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    monitorAuthState(setUser);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setIsDropdownOpen(false);
    setMenuOpen(false);
  };

  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
    setMenuOpen(false);
  };

  const toggleSignupModal = () => {
    setIsSignupOpen(!isSignupOpen);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gray-100 p-4 shadow-md" style={{ backgroundColor: "rgba(211, 211, 211, 0.9)" }}>
      <div className="container mx-auto">
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">LetzGrade</Link>
          </div>

          <div className="flex justify-center space-x-8">
            {user ? (
              <>
                <Link to="/" className="font-semibold hover:text-gray-600 transition">{t("home")}</Link>
                <Link to="/dashboard" className="font-semibold hover:text-gray-600 transition">{t("dashboard")}</Link>
                <Link to="/addStudyProgram" className="font-semibold hover:text-gray-600 transition">{t("addStudyProgram")}</Link>
              </>
            ) : (
              <>
                <Link to="/" className="font-semibold hover:text-gray-600 transition">{t("home")}</Link>
                <Link to="/about" className="font-semibold hover:text-gray-600 transition">{t("aboutUs")}</Link>
                <Link to="/contact" className="font-semibold hover:text-gray-600 transition">{t("contact")}</Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-semibold text-gray-700">{t("welcome")}, {user.displayName}</span>
                <Link to="/profile" className="font-semibold hover:text-gray-600 transition">{t("profile")}</Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 transition"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={toggleLoginModal} 
                  className="font-semibold hover:text-gray-600 transition"
                >
                  {t("login")}
                </button>
                <button 
                  onClick={toggleSignupModal} 
                  className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 transition"
                >
                  {t("signup")}
                </button>
              </>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <Languages size={20} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border shadow-lg rounded-md z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => changeLanguage("en")}>
                    English
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => changeLanguage("fr")}>
                    Français
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => changeLanguage("de")}>
                    Deutsch
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => changeLanguage("lux")}>
                    Lëtzebuergesch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-between">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="text-center">
            <Link to="/" className="text-2xl font-bold">LetzGrade</Link>
          </div>

          <div>
            {user ? (
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-gray-200 rounded-full text-red-500 transition"
              >
                <LogOut size={24} />
              </button>
            ) : (
              <div className="w-8 h-8"></div> // Empty div for layout balance
            )}
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-md shadow-lg overflow-hidden">
            <div className="p-4 space-y-3 border-b">
              {user ? (
                <div className="flex items-center space-x-2 pb-2">
                  <User size={20} className="text-gray-600" />
                  <span className="font-semibold">{user.displayName}</span>
                </div>
              ) : null}
              
              <div className="space-y-2">
                <Link to="/" className="block py-2 font-semibold" onClick={() => setMenuOpen(false)}>
                  {t("home")}
                </Link>
                
                {user ? (
                  <>
                    <Link to="/dashboard" className="block py-2 font-semibold" onClick={() => setMenuOpen(false)}>
                      {t("dashboard")}
                    </Link>
                    <Link to="/addStudyProgram" className="block py-2 font-semibold" onClick={() => setMenuOpen(false)}>
                      {t("addStudyProgram")}
                    </Link>
                    <Link to="/profile" className="block py-2 font-semibold" onClick={() => setMenuOpen(false)}>
                      {t("profile")}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/about" className="block py-2 font-semibold" onClick={() => setMenuOpen(false)}>
                      {t("aboutUs")}
                    </Link>
                    <Link to="/contact" className="block py-2 font-semibold" onClick={() => setMenuOpen(false)}>
                      {t("contact")}
                    </Link>
                    <button onClick={toggleLoginModal} className="block py-2 font-semibold w-full text-left">
                      {t("login")}
                    </button>
                    <button onClick={toggleSignupModal} className="block py-2 font-semibold w-full text-left">
                      {t("signup")}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Language Options in Mobile Menu */}
            <div className="p-4 border-t">
              <p className="font-semibold mb-2 text-gray-600 flex items-center">
                <Languages size={16} className="mr-2" /> {t("selectLanguage")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
                  onClick={() => changeLanguage("en")}
                >
                  🇬🇧 English
                </button>
                <button 
                  className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
                  onClick={() => changeLanguage("fr")}
                >
                  🇫🇷 Français
                </button>
                <button 
                  className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
                  onClick={() => changeLanguage("de")}
                >
                  🇩🇪 Deutsch
                </button>
                <button 
                  className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
                  onClick={() => changeLanguage("lux")}
                >
                  🇱🇺 Lëtzebuergesch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </nav>
  );
};

export default Navbar;