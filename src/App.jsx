import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import "./i18n";
import bg1 from "./assets/llc.jpg";
import bg2 from "./assets/furnace.jpg";
import bg3 from "./assets/llc2.jpg";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n} = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  const location = useLocation();

  const background1 = ["/", "/contact", "/addStudyProgram"];
  const background2 = ["/about", "/dashboard"];
  const background3 = ["/profile"];

  let backgroundImage = null;
  if (background1.includes(location.pathname)) {
    backgroundImage = bg1;
  } else if (background2.includes(location.pathname)) {
    backgroundImage = bg2;
  } else if (background3.includes(location.pathname)){
    backgroundImage = bg3;
  }

  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#DFDFDF] ${backgroundImage ? "bg-cover bg-center" : ""}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <Navbar />
      <main className="flex-grow flex">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
