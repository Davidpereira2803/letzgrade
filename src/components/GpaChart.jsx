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
    <ResponsiveContainer width={600} height={300}>
    <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="semester" />
        <YAxis domain={[2.5, 4.0]} />
        <Tooltip />
        <Line type="monotone" dataKey="gpa" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GpaChart;
