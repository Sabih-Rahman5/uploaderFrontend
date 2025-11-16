import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config/config';

const ModelComponent = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [status, setStatus] = useState('empty');
  const [label, setLabel] = useState('Status: empty');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleRunClick = async () => {
    if (!selectedModel) {
      setLabel("Status: please select a model");
      return;
    }

    setIsLoading(true);
    setLabel("Status: sending request...");

    try {
      const response = await fetch(BACKEND_URL + 'run-model/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_model: selectedModel }),
      });

      await response.json();
      setLabel("Status: loading started");
    } catch (err) {
      console.error(err);
      setLabel("Status: error communicating with backend");
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(BACKEND_URL + 'model-status/');
        const data = await res.json();

        setStatus(data.state);

        if (data.state === "clearing") {
          setLabel(`Status: unloading previous model...`);
        } else if (data.state === "loading") {
          setLabel(`Status: loading ${data.model_name}...`);
        } else if (data.state === "loaded") {
          setLabel(`Status: ${data.model_name} ready`);
          setIsLoading(false);
        } else if (data.state === "empty") {
          setLabel("Status: empty");
        }

      } catch (err) {
        console.error("Status polling error", err);
      }
    }, 800); // Poll every 800ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <select value={selectedModel} onChange={handleSelectChange}>
        <option value="">Select Model</option>
        <option value="DeepSeek-r1">DeepSeek-r1</option>
        <option value="Gemma-3">Gemma-3</option>
        <option value="Llama-3.2">Llama-3.2</option>
      </select>

      <button onClick={handleRunClick} disabled={isLoading}>
        Load
      </button>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        {label}
      </p>
    </div>
  );
};

export default ModelComponent;
