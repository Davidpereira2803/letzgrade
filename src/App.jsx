import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#DFDFDF] ${
        location.pathname === "/" ? "bg-cover bg-center" : ""
      }`}
      style={location.pathname === "/" ? { backgroundImage: "url('/UniversityOfLuxembourg.jpg')" } : {}}
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
