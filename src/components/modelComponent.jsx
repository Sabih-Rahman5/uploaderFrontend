import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config/config";
import axios from "axios";
import "./Styles/spinner.css";

const LoadModelComponent = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentModel, setCurrentModel] = useState(""); // track model currently loading or loaded
  const [progress, setProgress] = useState(0);

  const models = ["Llama-3.2", "DeepSeek-r1", "Gemma-3"];

  // ----------- LOAD STATUS ON PAGE REFRESH -----------
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(BACKEND_URL + "model-status/", {
          // --- Add this config object ---
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
          // ------------------------------
        });
        console.log("Model status on refresh:", res.data);  // <-- LOG HERE
        const { state, progress, model_name } = res.data;

        setCurrentModel(model_name);
        setProgress(progress);

        // Update UI based on backend state
        if (state === "loading") {
          setLoading(true);
          setStatusMessage(`Loading ${model_name}... (${progress}%)`);
        } else if (state === "loaded") {
          setLoading(false);
          setStatusMessage(`Model "${model_name}" loaded successfully.`);
        } else {
          setLoading(false);
          setStatusMessage("");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchStatus();
  }, []);

  // -----------------------------------------------

  const handleSelectChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleRunClick = async () => {
    if (!selectedModel) {
      setStatusMessage("Please select a model.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      const response = await axios.post(BACKEND_URL + "run-model/", {
        selected_model: selectedModel,
      });

      if (response.status === 200) {
        setStatusMessage("Model loading started...");
      } else {
        setStatusMessage("Failed to start loading.");
      }
    } catch (error) {
      setStatusMessage("Error starting model load.");
    } finally {
      // Backend will update status; no need to set loading false here
    }
  };

  return (
    <div>
      <h3>Select Model</h3>
      <select value={selectedModel} onChange={handleSelectChange}>
        <option value="">--Select Model--</option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

      <button onClick={handleRunClick} disabled={loading}>
        {loading ? "Loading..." : "Load"}
        {loading && <span className="spinner"></span>}
      </button>

      {statusMessage && (
        <p>
          {statusMessage}
          {loading && progress > 0 && ` (${progress}%)`}
        </p>
      )}
    </div>
  );
};

export default LoadModelComponent;
