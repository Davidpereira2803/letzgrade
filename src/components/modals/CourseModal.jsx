import { useEffect, useState } from "react";
import { doc, setDoc, collection, addDoc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";
import { auth, db} from "../../services/firebase";
import { FaTrash } from "react-icons/fa"
import Button from "../ui/Button";
import ExamModal from "./ExamModal";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const CourseModal = ({ isOpen, onClose, semester }) => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [newCredits, setNewCredits] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const userId = auth.currentUser?.uid;
  const studyProgramId = semester?.studyProgramId ?? "";
  const semesterId = semester?.id;

  useEffect(() => {
    if (!userId || !studyProgramId || !semesterId) return;
  
    const unsubscribe = onSnapshot(
      collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses"),
      (snapshot) => {
        const courseList = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          finalGrade: doc.data().finalGrade ?? "N/A"
        }));
        setCourses(courseList);
      }
    );
  
    return () => unsubscribe();
  }, [userId, studyProgramId, semesterId]);

  const formatFinalGrade = (finalGrade) => {
    return finalGrade !== "N/A" ? `${(finalGrade * 100).toFixed(1)} / 100` : "N/A";
};

  const handleAddCourse = async () => {
    if (!newCourse.trim() || !newCredits || !userId || !studyProgramId || !semesterId) return;
  
    await addDoc(collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses"), {
      name: newCourse,
      credits: parseInt(newCredits),
    });
  
    setNewCourse("");
    setNewCredits("");
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsExamModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!userId || !studyProgramId || !semesterId) return;

    try {
        const examsRef = collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams");
        const examsSnapshot = await getDocs(examsRef);

        const deletePromises = examsSnapshot.docs.map((examDoc) => 
            deleteDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams", examDoc.id))
        );

        await Promise.all(deletePromises);

        await deleteDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId));
    } catch (error) {
    }
  };

  if (!isOpen || !semester) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg min-h-[400px] flex flex-col justify-between relative">
        <button 
          className="absolute top-2 right-2 text-[#CA4B4B] hover:text-[#CA4B4B] text-xl"
          onClick={onClose}
        >
          <X size={24} strokeWidth={4} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{t("coursesTitle", { semester: semester.name })}</h2>

        <ul className="mb-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md mb-2 w-full transition">
                <button
                  key={course.id}
                  className="bg-gray-200 p-2 rounded-md mb-2 w-full text-left hover:bg-gray-300 transition flex justify-between"
                  onClick={ () => handleCourseClick(course)}
                  >
                  <span>{course.name} ({course.credits} ECTS)</span>
                  <span>{t("finalGrade")}: {formatFinalGrade(course.finalGrade)}</span>
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course.id)} 
                  className="text-red-500 hover:text-red-700 flex items-center justify-center ml-2 -mt-1"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">{t("noCourses")}</p>
          )}
        </ul>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={t("courseNamePlaceholder")}
            className="w-full px-3 py-2 border rounded-lg"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          />
          <input 
            type="number" 
            placeholder={t("ectsPlaceholder")} 
            className="w-20 px-3 py-2 border rounded-lg"
            value={newCredits}
            onChange={(e) => setNewCredits(e.target.value)}
          />
          <Button 
            text={t("addCourse")} 
            onClick={handleAddCourse} 
            className="hover:bg-[#CA4B4B]"
          />
        </div>
      </div>
      <ExamModal 
        isOpen={isExamModalOpen} 
        onClose={() => setIsExamModalOpen(false)}
        course={{ 
          ...selectedCourse, 
          studyProgramId: semester?.studyProgramId, 
          semesterId: semester?.id 
        }}
      />
    </div>
  );
};

export default CourseModal;
