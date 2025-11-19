import React, { useState } from "react";
import AssignmentUploader from "./components/AssignmentUploader";
import ModelComponent from "./components/modelComponent";
import "../Styles/App.css";
import { BACKEND_URL } from "./config/config";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDetailedOutput, setIsDetailedOutput] = useState(false);
  const [inferenceMessage, setInferenceMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(""); // Store the PDF URL

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleDetailedOutput = () => {
    setIsDetailedOutput((prev) => !prev);
  };

  const runInference = async () => {
    setInferenceMessage("Running inference...");
    setPdfUrl(""); // Clear old PDF

    try {
      const response = await fetch(BACKEND_URL + "run-inference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detailedOutput: isDetailedOutput, // Send the toggle value
        }),
      });
      // 1. IF ERROR (Status 400 or 500) -> It returns JSON
      if (!response.ok) {
        const errorData = await response.json();
        setInferenceMessage(`❌ ${errorData.error}`);
        return;
      }

      // 2. IF SUCCESS (Status 200) -> It returns a File (Blob), NOT JSON
      // We must use .blob() here, or the app will crash trying to parse PDF as JSON
      const blob = await response.blob();

      // Create a download link for the browser
      const downloadUrl = window.URL.createObjectURL(blob);

      setInferenceMessage("✅ Inference completed successfully!");
      setPdfUrl(downloadUrl);
    } catch (err) {
      console.error("Frontend Error:", err);
      setInferenceMessage("❌ Client error: Failed to parse response.");
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
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
        </section>

        <section className="model-section">
          <h2>Model List</h2>
          <ModelComponent />

          {/* ---- NEW BUTTON ---- */}
          <button className="run-btn" onClick={runInference}>
            Run Inference
          </button>

          {/* Toggle for Detailed Output */}
          <section className="toggle-detailed-output">
            <label>
              <input
                type="checkbox"
                checked={isDetailedOutput}
                onChange={toggleDetailedOutput}
              />
              Enable Detailed Output
            </label>
          </section>

          {/* ---- MESSAGE AREA ---- */}
          {inferenceMessage && (
            <p className="inference-message">{inferenceMessage}</p>
          )}

          {/* ---- DOWNLOAD PDF BUTTON ---- */}
          {pdfUrl && (
            <a href={pdfUrl} download="output">
              <button className="download-btn">Download results</button>
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
