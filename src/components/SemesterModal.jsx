import { useEffect, useState } from "react";
import { doc, setDoc, collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Button from "./Button";
import CourseModal from "./CourseModal";

const SemesterModal = ({ isOpen, onClose, studyProgram }) => {
  const [semesters, setSemesters] = useState([]);
  const [newSemester, setNewSemester] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const userId = auth.currentUser?.uid;
  const studyProgramId = studyProgram?.id;

  useEffect(() => {
    if (!userId || !studyProgramId) return;
  
    const unsubscribe = onSnapshot(
      collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters"),
      (snapshot) => {
        const semesterList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSemesters(semesterList);
      }
    );
  
    return () => unsubscribe();
  }, [userId, studyProgramId]);

  const handleAddSemester = async () => {
    if (!newSemester.trim()) return;
  
    await addDoc(collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters"), {
      name: newSemester,
    });
  
    setNewSemester("");
  };
  
  const calculateSemesterGrade = (courses = []) => {
    if (courses.length === 0) return "N/A";
  
    const totalWeightedGrade = courses.reduce((sum, course) => sum + (course.finalGrade * course.credits), 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  
    return totalCredits > 0 ? (totalWeightedGrade / totalCredits).toFixed(2) : "N/A";
  };

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
    setIsCourseModalOpen(true);
  };

  if (!isOpen || !studyProgram) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button 
          className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{studyProgram.name} - Semesters</h2>

        <ul className="mb-4">
          {semesters.length > 0 ? (
            semesters.map((semester) => (
              <button 
                key={semester.id} 
                className="bg-gray-200 p-2 rounded-md mb-2 w-full text-left hover:bg-gray-300 transition flex justify-between"
                onClick={() => handleSemesterClick(semester)}
              >
                  <span>{semester.name}</span>
                  <span>Final Grade: {calculateSemesterGrade(semester.courses)}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center">No semesters yet.</p>
          )}
        </ul>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="New Semester Name" 
            className="w-full px-3 py-2 border rounded-lg"
            value={newSemester}
            onChange={(e) => setNewSemester(e.target.value)}
          />
          <Button 
            text="Add" 
            onClick={handleAddSemester} 
            className="hover:bg-[#CA4B4B]"
          />
        </div>
      </div>

      <CourseModal 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)}
        semester={{ ...selectedSemester, studyProgramId: studyProgram?.id }}
      />
    </div>
  );
};

export default SemesterModal;
