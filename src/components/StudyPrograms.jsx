import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, updateDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import SemesterModal from "./modals/SemesterModal";
import { useTranslation } from "react-i18next";

const StudyPrograms = () => {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(collection(db, "users", userId, "studyPrograms"), async (snapshot) => {
        const programs = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
            const programData = { id: docSnapshot.id, ...docSnapshot.data() };

            const semestersRef = collection(db, "users", userId, "studyPrograms", docSnapshot.id, "semesters");

            const semestersSnapshot = await getDocs(semestersRef);
            programData.semesters = semestersSnapshot.docs.map((semesterDoc) => ({
                id: semesterDoc.id,
                ...semesterDoc.data(),
                finalGrade: semesterDoc.data().finalGrade ?? "N/A",
                credits: semesterDoc.data().credits ?? 30,
            }));

            const computedGPA = calculateGPA(programData.semesters);

            if (computedGPA !== programData.gpa) {
                await updateGPA(programData.id, computedGPA);
            }

            programData.gpa = computedGPA;
            return programData;
        }));

        setStudyPrograms(programs);
    });

    return () => unsubscribe();
}, [userId]);


  const calculateGPA = (semesters = []) => {
    if (semesters.length === 0) return "N/A";

    let totalWeightedGrade = 0;
    let totalCredits = 0;

    semesters.forEach((semester) => {
        const semesterFinalGrade = parseFloat(semester.finalGrade);
        const semesterCredits = parseFloat(semester.credits) || 30;

        if (!isNaN(semesterFinalGrade) && semesterCredits > 0) {
            totalWeightedGrade += semesterFinalGrade * semesterCredits;
            totalCredits += semesterCredits;
        }
    });

    return totalCredits > 0 ? (totalWeightedGrade / totalCredits).toFixed(2) : "N/A";
};


  const updateGPA = async (studyProgramId, gpa) => {
    try {
      const gpaToStore = gpa !== "N/A" ? parseFloat(gpa) : null;

      await updateDoc(doc(db, "users", userId, "studyPrograms", studyProgramId), {
        gpa: gpaToStore,
      });
    } catch (error) {
    }
  };

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  return (
    <div>
      {studyPrograms.length > 0 ? (
        studyPrograms.map((program) => (
          <button
            key={program.id}
            className="w-full bg-gray-200 p-4 rounded-lg mb-3 shadow-sm flex justify-between items-center hover:bg-gray-300 transition"
            onClick={() => handleProgramClick(program)}
          >
            <h3 className="text-lg font-semibold">{program.name}</h3>
            <p className="text-gray-700 font-medium">
              {t("gpa")}: {program.gpa !== null ? `${parseFloat(program.gpa * 100).toFixed(1)} / 100` : "N/A"}
            </p>
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-center">{t("noStudyPrograms")}</p>
      )}

      <SemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studyProgram={selectedProgram}
      />
    </div>
  );
};

export default StudyPrograms;
