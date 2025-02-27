import GpaChart from "../components/GpaChart";
import StudyPrograms from "../components/StudyPrograms";

const Dashboard = () => {
  return (
    <div className="flex-col flex items-center justify-center flex-grow">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Semester Grades</h2>
          <GpaChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Study Programs</h2>
          <StudyPrograms />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
