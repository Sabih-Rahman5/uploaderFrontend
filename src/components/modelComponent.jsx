import React, { useState } from 'react';

const ModelComponent = () => {
  const [selectedModel, setSelectedItem] = useState('');
  const [error, setError] = useState('');

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
    setError(''); // Reset error when the user selects a model
  };

  const handleRunClick = async () => {
    if (!selectedModel) {
      setError('Please select a model');
      return; // Stop the function if no model is selected
    }

    console.log('Selected Item:', selectedModel);

    try {
      // Send a POST request to the Django backend
      const response = await fetch('http://localhost:8000/api/run-model/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_model: selectedModel }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Backend Response:', data.message); // "Item printed successfully"
      } else {
        console.error('Error:', data.error); // "No item selected"
      }
    } catch (error) {
      console.error('Error while sending request:', error);
    }
  };

  return (
    <div>
      <select value={selectedModel} onChange={handleSelectChange}>
        <option value="">Select an item</option>
        <option value="LLama_3.2_4B">LLama 3.2 4B</option>
        <option value="Gemma_3">Gemma 3</option>
        <option value="DeepSeek_R1">DeepSeek R1</option>
      </select>
      <button onClick={handleRunClick}>Run</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error in red */}
    </div>
  );
};

export default ModelComponent;
