import { useState } from "react"
import SemesterModal from "./SemesterModal";

const StudyPrograms = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const programs = [
    { id: 1, name: "Bachelor in Computer Science", gpa: 3.7 },
    { id: 2, name: "Bachelor in Engineering", gpa: 3.5 },
    { id: 3, name: "Bachelor in Mathematics", gpa: 3.8 },
  ];

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  return (
    <div>
      {programs.length > 0 ? (
        programs.map((program) => (
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
