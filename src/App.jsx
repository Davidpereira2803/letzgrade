import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import bg from "./assets/llc.jpg";

function App() {
  const location = useLocation();

  const showBackground = ["/", "/contact", "/about"].includes(location.pathname)
  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#DFDFDF] ${
        showBackground ? "bg-cover bg-center" : ""
      }`}
      style={showBackground ? { backgroundImage: `url(${bg})` } : {}}
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
