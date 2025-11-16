import React, { useState } from 'react';
import { BACKEND_URL } from '../config/config';

const ModelComponent = () => {
  const [selectedModel, setSelectedItem] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress state

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
    setError(''); // Reset error when the user selects a model
  };

  const handleRunClick = async () => {
    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    console.log('Selected Item:', selectedModel);
    setIsLoading(true); // Start loading
    setProgress(0); // Reset progress

    try {
      const response = await fetch(BACKEND_URL + 'run-model/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_model: selectedModel }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Backend Response:', data.message);

        // Simulate progress bar
        let progressBar = 0;
        const interval = setInterval(() => {
          if (progressBar < 100) {
            progressBar += 10; // Simulate progress
            setProgress(progressBar);
          } else {
            clearInterval(interval); // Stop the progress when complete
            setIsLoading(false); // Stop loading
          }
        }, 500); // Update every 500ms
      } else {
        console.error('Error:', data.error);
        setError(data.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <select value={selectedModel} onChange={handleSelectChange}>
        <option value="">Select an item</option>
        <option value="DeepSeek-r1">DeepSeek-r1</option>
        <option value="Gemma-3">Gemma-3</option>
        <option value="Llama-3.2">Llama-3.2</option>
      </select>
      <button onClick={handleRunClick} disabled={isLoading}>Load</button>
      {isLoading && (
        <div style={{ marginTop: '20px' }}>
          <p>Loading... {progress}%</p>
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: 'green',
                transition: 'width 0.5s ease',
              }}
            ></div>
          </div>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ModelComponent;
