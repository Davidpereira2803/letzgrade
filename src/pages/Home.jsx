import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center flex-grow">
      <div className="text-white text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to LetzGrade</h1>
        <p className="text-lg mb-6">Track your grades efficiently.</p>

        <Button
          text="🚀 Get Started"
          onClick={() => navigate("/dashboard")}
          className="bg-[#C0C0C0] bg-opacity-50 hover:bg-[#CA4B4B] text-white px-6 py-3 rounded-lg transition duration-300"
        />
      </div>
    </div>
  );
};

export default Home;
