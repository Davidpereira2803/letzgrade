import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const GpaChart = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();

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
        <XAxis dataKey="semester" label={{ value: t("xAxisLabel"), position: "insideBottom", offset: -5 }} />
        <YAxis domain={[0, 100]} label={{ value: t("yAxisLabel"), angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => `${t("tooltipGrade", { value })}`}/>
        <Line type="monotone" dataKey="finalGrade" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GpaChart;
