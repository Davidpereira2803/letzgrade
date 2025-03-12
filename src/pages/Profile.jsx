import React, { useState } from "react";
import { auth } from "../services/firebase";
import { updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const Profile = () => {
  const user = auth.currentUser;
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      await updateProfile(user, { displayName: newName });
      setIsEditingName(false);
    } catch (err) {
      setError("Failed to update name. Try again.");
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !password.trim()) {
      setError("Email and password cannot be empty.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);

      await reauthenticateWithCredential(user, credential);

      await updateEmail(user, newEmail);
      setIsEditingEmail(false)
      setPassword("");
      window.location.reload(); 
    } catch (err) {
      setError("Failed to update email. Incorrect password or permission issue.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {user ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-semibold">Email:</label>
            {isEditingEmail ? (
              <>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />
              </>
            ) : (
              <p className="text-gray-700">{user.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Name:</label>
            {isEditingName ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p className="text-gray-700">{user.displayName || "No name set"}</p>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex space-x-2">
            {isEditingName ? (
              <>
                <button 
                  onClick={handleUpdateName}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Name
                </button>
                <button 
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditingName(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Edit Name
              </button>
            )}

            {isEditingEmail ? (
              <>
                <button 
                  onClick={handleUpdateEmail}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Email
                </button>
                <button 
                  onClick={() => setIsEditingEmail(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditingEmail(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Edit Email
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
