import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { semester: "Semester 1", gpa: 3.2 },
  { semester: "Semester 2", gpa: 3.5 },
  { semester: "Semester 3", gpa: 3.1 },
  { semester: "Semester 4", gpa: 3.8 },
  { semester: "Semester 5", gpa: 3.6 },
];

const GpaChart = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semester" />
          <YAxis domain={[0.0, 5.0]} />
          <Tooltip />
          <Line type="monotone" dataKey="gpa" stroke="#4A90E2" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GpaChart;
