const StudyPrograms = () => {
    const programs = [
      { id: 1, name: "Computer Science", courses: 10 },
      { id: 2, name: "Engineering", courses: 8 },
      { id: 3, name: "Mathematics", courses: 6 },
    ];
  
    return (
      <div>
        {programs.map((program) => (
          <div key={program.id} className="bg-gray-200 p-4 rounded-lg mb-3 shadow-sm">
            <h3 className="text-lg font-semibold">{program.name}</h3>
            <p>{program.courses} courses available</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default StudyPrograms;
  