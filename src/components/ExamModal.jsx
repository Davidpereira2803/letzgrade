import { useState } from "react";
import Button from "./Button";

const ExamModal = ({ isOpen, onClose, course }) => {
  const [exams, setExams] = useState([
    { id: 1, name: "Midterm", grade: 85, weight: 40, scale: 100 },
    { id: 2, name: "Final Exam", grade: 90, weight: 60, scale: 100 },
  ]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [newExam, setNewExam] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [gradingScale, setGradingScale] = useState(100);

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setNewExam(exam.name);
    setNewGrade(exam.grade);
    setNewWeight(exam.weight);
    setGradingScale(exam.scale);
  };

  const handleSaveExam = () => {
    if (newExam.trim() === "" || newGrade === "" || newWeight === ""){ alert("Please enter valid exam details."); return;}

    if(selectedExam){
        setExams(exams.map((exam) =>
            exam.id === selectedExam.id
              ? { ...exam, name: newExam, grade: parseFloat(newGrade), weight: parseFloat(newWeight), scale: gradingScale }
              : exam
          ));
          setSelectedExam(null);
    } else {
        const newId = exams.length + 1;
        setExams([...exams, { id: newId, name: newExam, grade: parseFloat(newGrade), weight: parseFloat(newWeight), scale: gradingScale }]);
    }

    setNewExam("");
    setNewGrade("");
    setNewWeight("");
    setGradingScale(100);
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
