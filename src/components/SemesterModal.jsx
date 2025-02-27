import { useState } from "react";
import Button from "./Button";
import CourseModal from "./CourseModal";

const SemesterModal = ({ isOpen, onClose, studyProgram }) => {
  const [semesters, setSemesters] = useState([
    { id: 1, name: "Semester 1" },
    { id: 2, name: "Semester 2" },
  ]);
  const [newSemester, setNewSemester] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const handleAddSemester = () => {
    if (newSemester.trim() === "") return;

    const newId = semesters.length + 1;
    setSemesters([...semesters, { id: newId, name: newSemester }]);
    setNewSemester("");
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
                className="bg-gray-200 p-2 rounded-md mb-2 w-full text-left hover:bg-gray-300 transition"
                onClick={() => handleSemesterClick(semester)}
              >
                {semester.name}
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
        semester={selectedSemester}
      />
    </div>
  );
};

export default SemesterModal;
