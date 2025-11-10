import React, { useState } from "react";
import AssignmentUploader from "./components/AssignmentUploader";
// import KnowledgebaseUploader from "./components/nowledgeBaseUploader";
// import AssignmentList from "./components/AssignmentList";
import ModelComponent from "./components/modelComponent";
// import DidMount from "./components/DidMount";
import "./App.css";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
                {/* <DidMount /> */}
      <header>
        <h1>LLM Uploader Demo</h1>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </header>
      <div className="content-container">
        <section className="upload-section">
          <h2>Upload</h2>
          <AssignmentUploader />
          {/* <KnowledgebaseUploader /> */}
        </section>
        <section className="model-section">
          <h2>Model List</h2>
          <ModelComponent />
        </section>
      </div>
    </div>
  );
}
