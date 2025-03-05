import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GpaChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        // 1️⃣ Fetch the most recent study program (sorted by creation date)
        const studyProgramsRef = collection(db, "users", userId, "studyPrograms");
        const studyProgramQuery = query(studyProgramsRef, orderBy("createdAt", "desc"), limit(1));
        const studyProgramSnapshot = await getDocs(studyProgramQuery);

        if (studyProgramSnapshot.empty) {
          console.log("No study programs found.");
          return;
        }

        const latestStudyProgram = studyProgramSnapshot.docs[0];
        const studyProgramId = latestStudyProgram.id;

        // 2️⃣ Fetch semesters for this study program
        const semestersRef = collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters");
        const semestersSnapshot = await getDocs(semestersRef);

        const semesterData = semestersSnapshot.docs.map((doc) => ({
          semester: doc.data().name, // Semester name
          gpa: doc.data().gpa || 0, // Default GPA to 0 if missing
        }));

        setData(semesterData);
      } catch (error) {
        console.error("Error fetching GPA data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="semester" />
        <YAxis domain={[0, 4]} />
        <Tooltip />
        <Line type="monotone" dataKey="gpa" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GpaChart;
