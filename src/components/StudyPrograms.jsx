import { useEffect, useState } from "react"
import { auth, db } from "../services/firebase";
import { doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import SemesterModal from "./SemesterModal";

const StudyPrograms = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const fetchPrograms = async () => {
        const querySnapshot = await getDocs(collection(db, "users", userId, "studyPrograms"));
        const programs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudyPrograms(programs);
      };
      fetchPrograms();
    }
  }, [userId]);

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
            <p className="text-gray-700 font-medium">GPA: {program.gpa.toFixed(2)}</p>
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-center">No study programs selected yet.</p>
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
