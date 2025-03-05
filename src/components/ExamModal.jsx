import { useEffect, useState } from "react";
import { doc, setDoc, collection, addDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import {auth, db } from "../services/firebase";
import Button from "./Button";

const ExamModal = ({ isOpen, onClose, course }) => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [newExam, setNewExam] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [gradingScale, setGradingScale] = useState(100);

  const userId = auth.currentUser?.uid;
  const studyProgramId = course?.studyProgramId ?? "";
  const semesterId = course?.semesterId ?? "";
  const courseId = course?.id;

  useEffect(() => {
    if (!userId || !studyProgramId || !semesterId || !courseId) return;
  
    const unsubscribe = onSnapshot(
      collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams"),
      (snapshot) => {
        const examList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setExams(examList);

        updateFinalGrade(examList);
      }
    );
  
    return () => unsubscribe();
  }, [userId, studyProgramId, semesterId, courseId]);

  const updateFinalGrade = async (examList) => {
    if (!courseId || !userId || !studyProgramId || !semesterId) return;
    
    const totalWeightedScore = examList.reduce((sum, exam) => sum + exam.grade * (exam.weight / 100), 0);
    const totalWeight = examList.reduce((sum, exam) => sum + (exam.weight / 100), 0);
    const finalGrade = totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : "N/A";
  
    try {
      await updateDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId), {
        finalGrade: finalGrade
      });
    } catch (error) {
      console.error("🔥 Error updating final grade:", error);
    }
  };
  

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setNewExam(exam.name);
    setNewGrade(exam.grade);
    setNewWeight(exam.weight);
    setGradingScale(exam.scale);
  };

  const handleSaveExam = async () => {
    if (!newExam.trim() || !newGrade || !newWeight || !userId || !studyProgramId || !semesterId || !courseId) return;
   
    try {
      if (selectedExam) {
        await setDoc(doc(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams", selectedExam.id), {
          name: newExam,
          grade: parseFloat(newGrade),
          weight: parseFloat(newWeight),
          scale: gradingScale,
        });
      } else {
        await addDoc(collection(db, "users", userId, "studyPrograms", studyProgramId, "semesters", semesterId, "courses", courseId, "exams"), {
          name: newExam,
          grade: parseFloat(newGrade),
          weight: parseFloat(newWeight),
          scale: gradingScale,
        });
      }
    } catch (error) {
      console.error("Error saving exam:", error);
    }
  
    setNewExam("");
    setNewGrade("");
    setNewWeight("");
    setGradingScale(100);
    setSelectedExam(null);
  };
  

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg min-h-[400px] flex flex-col justify-between relative">
        <button 
          className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{course.name} - Exams</h2>

        <ul className="mb-4">
          {exams.length > 0 ? (
            exams.map((exam) => (
              <button
                key={exam.id}
                className="bg-gray-200 p-2 rounded-md mb-2 w-full text-left hover:bg-gray-300 transition flex justify-between"
                onClick={() => handleExamClick(exam)}
                >
                <span>{exam.name}</span>
                <span>{exam.grade}/{exam.scale} ({exam.weight}%)</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center">No exams added yet.</p>
          )}
        </ul>

        <div className="flex flex-col gap-2">
          <input 
            type="text" 
            placeholder="Exam Name" 
            className="w-full px-3 py-2 border rounded-lg"
            value={newExam}
            onChange={(e) => setNewExam(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Grade" 
              className="w-1/2 px-3 py-2 border rounded-lg"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Weight (%)" 
              className="w-1/2 px-3 py-2 border rounded-lg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <select 
              className="w-1/3 px-3 py-2 border rounded-lg"
              value={gradingScale}
              onChange={(e) => setGradingScale(parseInt(e.target.value))}
            >
              <option value={20}>/20</option>
              <option value={60}>/60</option>
              <option value={100}>/100</option>
            </select>
          </div>
          <Button 
            text={selectedExam ? "Update Exam" : "Add Exam"} 
            onClick={handleSaveExam} 
            className="hover:bg-[#CA4B4B]"
          />
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
