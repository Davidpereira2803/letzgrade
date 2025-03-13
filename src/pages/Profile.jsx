import React, { useState } from "react";
import {
  getAuth,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const navigate = useNavigate();

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const [newName, setNewName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Name cannot be empty.</>);
      return;
    }

    try {
      await updateProfile(user, { displayName: newName });
      await user.reload();
      setIsEditingName(false);
      setSuccessMessage(<><FaCheckCircle className="inline text-green-500" /> Name updated successfully!</>);
    } catch (err) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Failed to update name. Try again.</>);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Please fill in both password fields.</>);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccessMessage(<><FaCheckCircle className="inline text-green-500" /> Password updated successfully!</>);
      setCurrentPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
    } catch (error) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Error updating password: {error.message}</>);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(user);
      setSuccessMessage(<><FaCheckCircle className="inline text-green-500" /> Verification email sent! Please check your inbox.</>);
      await user.reload();
    } catch (error) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Error sending verification email: {error.message}</>);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentPassword.trim()) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Please enter your password to delete your account.</>);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);

      await deleteUser(user);

      setSuccessMessage(<><FaCheckCircle className="inline text-green-500" /> Account and data deleted successfully.</>);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setErrorMessage(<><FaTimesCircle className="inline text-red-500" /> Error deleting account: {error.message}</>);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {user ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-semibold">Email:</label>
            <p className="text-gray-700">{user.email}</p>
            {!user.emailVerified && (
              <button
                onClick={handleVerifyEmail}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mt-2"
              >
                Verify Email
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Name:</label>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={handleUpdateName}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                >
                  Save Name
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setNewName(user.displayName || "");
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700">{user.displayName || "No name set"}</p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
                >
                  Edit Name
                </button>
              </>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Change Password:</label>
            {isEditingPassword ? (
              <>
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />
                <button
                  onClick={handleUpdatePassword}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setIsEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
              >
                Change Password
              </button>
            )}
          </div>

          <div className="mt-6">
            {isDeleting ? (
              <>
                <input
                  type="password"
                  placeholder="Enter password to confirm deletion"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2"
                >
                  Confirm Delete Account
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsDeleting(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2"
              >
                Delete Account
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
