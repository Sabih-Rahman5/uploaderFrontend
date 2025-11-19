import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config/config";
import axios from "axios";
import "./Styles/spinner.css";
import "./Styles/modelComponent.css";


const LoadModelComponent = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentModel, setCurrentModel] = useState(""); // track model currently loading or loaded

  const models = ["Llama-3.2", "DeepSeek-r1", "Gemma-3"];

  // ----------- LOAD STATUS ON PAGE REFRESH -----------

  const fetchStatus = async () => {
    try {
      const res = await axios.get(BACKEND_URL + "model-status/", {
        // --- Add this config object ---
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        // ------------------------------
      });
      console.log("Model status on refresh:", res.data);
      const { state, model_name } = res.data;

      setCurrentModel(model_name);

      if (state === "loading") {
        setLoading(true);
      } else if (state === "loaded") {
        setLoading(false);
        setStatusMessage(`Model "${model_name}" loaded successfully.`);
      } else if (state === "idle") {
        setLoading(false);
        setStatusMessage(`Idle. No model loaded`);
      } else {
        setLoading(false);
        setStatusMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
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
        await fetchStatus();
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
  <div className="model-selector">
    <h3 className="model-selector__title">Select Model</h3>

    <select
      className="model-selector__dropdown"
      value={selectedModel}
      onChange={handleSelectChange}
    >
      <option value="">--Select Model--</option>
      {models.map((model) => (
        <option
          key={model}
          value={model}
          className="model-selector__option"
        >
          {model}
        </option>
      ))}
    </select>

    <button
      className="model-selector__button"
      onClick={handleRunClick}
      disabled={loading}
    >
      {loading ? "Loading..." : "Load"}
      {loading && <span className="model-selector__spinner"></span>}
    </button>

    {statusMessage && (
      <p className="model-selector__status">{statusMessage}</p>
    )}
  </div>
);

};

export default LoadModelComponent;
