import { useState, useEffect } from "react";
import { db } from "./services/firebase"; // Import Firestore instance
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState("Checking Firebase...");

  useEffect(() => {
    if (db) {
      setFirebaseStatus("✅ Firebase is successfully connected!");
      console.log("Firebase initialized:", db);
    } else {
      setFirebaseStatus("❌ Firebase failed to initialize.");
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Firebase</h1>
      <div className="card">
        <p>{firebaseStatus}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
