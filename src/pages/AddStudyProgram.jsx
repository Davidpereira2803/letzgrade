import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import Button from "../components/ui/Button";

const AddStudyProgram = () => {
  const [programName, setProgramName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;

  const handleAddStudyProgram = async (e) => {
    e.preventDefault();
    if (!programName.trim() || !userId) return;

    try {
      setLoading(true);
      await addDoc(collection(db, "users", userId, "studyPrograms"), {
        name: programName,
        gpa: 0,
      });
      navigate("/dashboard");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Study Program</h2>

        <form onSubmit={handleAddStudyProgram} className="flex flex-col gap-4">
          <input 
            type="text"
            placeholder="Study Program Name"
            className="w-full px-3 py-2 border rounded-lg"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            required
          />
          <Button 
            text={loading ? "Adding..." : "Add Study Program"} 
            onClick={handleAddStudyProgram} 
            className="bg-blue-500 hover:bg-blue-600 w-full"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddStudyProgram;
