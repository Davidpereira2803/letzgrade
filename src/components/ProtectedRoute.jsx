import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
