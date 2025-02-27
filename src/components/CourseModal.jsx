import { useState } from "react";
import Button from "./Button";
import ExamModal from "./ExamModal";

const CourseModal = ({ isOpen, onClose, semester }) => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Math 101", credits: 3, exams: [{ grade: 85, weight: 40 }, { grade: 90, weight: 60 }] },
    { id: 2, name: "Physics 102", credits: 4, exams: [{ grade: 78, weight: 50 }, { grade: 88, weight: 50 }] },
  ]);
  const [newCourse, setNewCourse] = useState("");
  const [newCredits, setNewCredits] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const handleAddCourse = () => {
    if (newCourse.trim() === "" || newCredits.trim() === "") return;

    const newId = courses.length + 1;
    setCourses([...courses, { id: newId, name: newCourse, credits: parseInt(newCredits), exams: [] }]);
    setNewCourse("");
    setNewCredits("");
  };

  const calculateFinalGrade = (exams) => {
    if (exams.length === 0) return "N/A";

    const totalWeightedScore = exams.reduce((sum, exam) => sum + exam.grade * (exam.weight / 100), 0);
    const totalWeight = exams.reduce((sum, exam) => sum + (exam.weight / 100), 0);

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : "N/A";
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsExamModalOpen(true);
  };

  if (!isOpen || !semester) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button 
          className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{semester.name} - Courses</h2>

        <ul className="mb-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <button
                key={course.id}
                className="bg-gray-200 p-2 rounded-md mb-2 w-full text-left hover:bg-gray-300 transition flex justify-between"
                onClick={ () => handleCourseClick(course)}
                >
                <span>{course.name} ({course.credits} ECTS)</span>
                <span>Final Grade: {calculateFinalGrade(course.exams)}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center">No courses added yet.</p>
          )}
        </ul>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Course Name" 
            className="w-full px-3 py-2 border rounded-lg"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="ECTS" 
            className="w-20 px-3 py-2 border rounded-lg"
            value={newCredits}
            onChange={(e) => setNewCredits(e.target.value)}
          />
          <Button 
            text="Add" 
            onClick={handleAddCourse} 
            className="hover:bg-[#CA4B4B]"
          />
        </div>
      </div>
      <ExamModal 
        isOpen={isExamModalOpen} 
        onClose={() => setIsExamModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default CourseModal;
