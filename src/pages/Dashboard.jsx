import { FaChartBar, FaChartLine, FaBook} from "react-icons/fa";
import GpaChart from "../components/GpaChart";
import StudyPrograms from "../components/StudyPrograms";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full px-4">
      <h1 className="text-2xl font-bold mb-6 text-center flex items-center gap-2">
        <FaChartBar className="text-blue-500" /> Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4"><FaChartLine className="text-green-500" /> Semester Grades</h2>
          <GpaChart />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4"><FaBook className="text-purple-500" /> Study Programs</h2>
          <StudyPrograms />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
