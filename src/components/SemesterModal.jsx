import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc } from "firebase/firestore";
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
      async (snapshot) => {
        const semesterList = await Promise.all(snapshot.docs.map(async (doc) => {
          const semesterData = { id: doc.id, ...doc.data() };

          // Fetch courses for each semester
          const coursesSnapshot = await getDocs(collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", doc.id, "courses"));
          semesterData.courses = coursesSnapshot.docs.map(courseDoc => ({ id: courseDoc.id, ...courseDoc.data() }));

          // Compute semester final grade
          semesterData.finalGrade = calculateSemesterGrade(semesterData.courses);

          return semesterData;
        }));

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
  
    let totalWeightedGrade = 0;
    let totalCredits = 0;
    let scale = 100;  // Default scale
  
    courses.forEach(course => {
      const courseScale = course.exams?.[0]?.scale || 100; // Take the first exam's scale
      scale = courseScale;
      totalWeightedGrade += (parseFloat(course.finalGrade) || 0) * (course.credits || 0);
      totalCredits += course.credits || 0;
    });
  
    const semesterFinalGrade = totalCredits > 0 ? (totalWeightedGrade / totalCredits).toFixed(2) : "N/A";
    return `${semesterFinalGrade} / ${scale}`;
  };
  

  const updateSemesterGrade = async (semesterId, finalGrade) => {
    try {
      await updateDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId), {
        finalGrade: finalGrade,
      });
    } catch (error) {
      console.error("🔥 Error updating semester grade:", error);
    }
  };

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
    setIsCourseModalOpen(true);
  };

  if (!isOpen || !studyProgram) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg min-h-[400px] flex flex-col justify-between relative">
        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl"
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
                <span>Final Grade: {calculateSemesterGrade(semester.courses || [])}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center">No semesters yet.</p>
          )}
        </ul>

        <div className="flex flex-wrap gap-2 items-center justify-center">
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
