import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GpaChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const fetchGPAData = async () => {
      try {
        const studyProgramsSnapshot = await getDocs(collection(db, "users", userId, "studyPrograms"));
        let semesterData = [];

        for (const studyProgram of studyProgramsSnapshot.docs) {
          const studyProgramId = studyProgram.id;

          const semestersRef = collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters");
          const semestersSnapshot = await getDocs(semestersRef);

          semestersSnapshot.docs.forEach((doc) => {

            const finalGrade = parseFloat(doc.data().finalGrade) || 0;
            semesterData.push({
              semester: doc.data().name,
              finalGrade: (finalGrade * 100).toFixed(1),
            });
          });
        }
        semesterData.sort((a, b) => a.semester.localeCompare(b.semester));
        setData(semesterData);
      } catch (error) {
      }
    };

    fetchGPAData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="semester" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="finalGrade" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GpaChart;
