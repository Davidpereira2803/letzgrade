import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { FaTrash } from "react-icons/fa";
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
        const semesterList = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const semesterData = { id: docSnapshot.id, ...docSnapshot.data() };

            const coursesSnapshot = await getDocs(
              collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", docSnapshot.id, "courses")
            );
            semesterData.courses = coursesSnapshot.docs.map((courseDoc) => ({
              id: courseDoc.id,
              ...courseDoc.data(),
            }));

            const computedFinalGrade = calculateSemesterGrade(semesterData.courses);

            if (computedFinalGrade !== semesterData.finalGrade) {
              await updateSemesterGrade(semesterData.id, computedFinalGrade);
            }

            semesterData.finalGrade = computedFinalGrade;
            return semesterData;
          })
        );
        semesterList.sort((a, b) => {
          const numA = parseInt(a.name.match(/\d+/)?.[0]) || 0;
          const numB = parseInt(b.name.match(/\d+/)?.[0]) || 0;
          return numA - numB;
        });

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

    courses.forEach((course) => {
      const courseFinalGrade = parseFloat(course.finalGrade);
      const courseCredits = parseFloat(course.credits);

      if (!isNaN(courseFinalGrade) && courseCredits > 0) {
        totalWeightedGrade += courseFinalGrade * courseCredits;
        totalCredits += courseCredits;
      }
    });

    return totalCredits > 0 ? (totalWeightedGrade / totalCredits).toFixed(2) : "N/A";
  };

  const updateSemesterGrade = async (semesterId, finalGrade) => {
    try {
      const gradeToStore = finalGrade !== "N/A" ? parseFloat(finalGrade) : null;

      await updateDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId), {
        finalGrade: gradeToStore,
      });
    } catch (error) {
    }
  };

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
    setIsCourseModalOpen(true);
  };

  const handleDeleteSemester = async (semesterId) => {
    if (!userId || !studyProgramId) return;

    try {
        const coursesRef = collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses");
        const coursesSnapshot = await getDocs(coursesRef);

        const deleteCoursePromises = coursesSnapshot.docs.map(async (courseDoc) => {
            const courseId = courseDoc.id;

            const examsRef = collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams");
            const examsSnapshot = await getDocs(examsRef);

            const deleteExamPromises = examsSnapshot.docs.map((examDoc) => 
                deleteDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams", examDoc.id))
            );

            await Promise.all(deleteExamPromises);
            return deleteDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId));
        });

        await Promise.all(deleteCoursePromises);

        await deleteDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId));
    } catch (error) {
    }
  };

  if (!isOpen || !studyProgram) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg min-h-[400px] flex flex-col justify-between relative">
        <button className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl" onClick={onClose}>
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{studyProgram.name} - Semesters</h2>

        <ul className="mb-4">
          {semesters.length > 0 ? (
            semesters.map((semester) => (
              <div key={semester.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md mb-2 w-full transition">
                <button
                  key={semester.id}
                  className="bg-gray-200 p-2 rounded-md mb-2 w-full text-left hover:bg-gray-300 transition flex justify-between"
                  onClick={() => handleSemesterClick(semester)}
                >
                  <span>{semester.name}</span>
                  <span>Final Grade: {semester.finalGrade !== null ? `${parseFloat(semester.finalGrade * 100).toFixed(1)} / 100` : "N/A"}</span>
                  </button>
                  <button 
                  onClick={() => handleDeleteSemester(semester.id)} 
                  className="text-red-500 hover:text-red-700 flex items-center justify-center ml-2 -mt-1"
                  >
                  <FaTrash size={18} />
                </button>
              </div>
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
          <Button text="Add" onClick={handleAddSemester} className="hover:bg-[#CA4B4B]" />
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
