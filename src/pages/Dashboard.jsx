import GpaChart from "../components/GpaChart";

const Dashboard = () => {
  return (
    <div className="flex-col flex items-center justify-center flex-grow">
      <h2 className="text-center text-3xl font-bold">Dashboard</h2>
      <GpaChart />
    </div>
  );
};

export default Dashboard;
