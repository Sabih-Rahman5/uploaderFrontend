import React, { useState, useEffect, useRef } from 'react';
import { BACKEND_URL } from '../config/config';

const ModelComponent = () => {
  const [selectedModel, setSelectedItem] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pollRef = useRef(null);

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
    setError('');
  };

  const startPolling = () => {
    // clear previous if any
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(BACKEND_URL + 'model-status/');
        if (!res.ok) {
          // optional: handle server errors
          return;
        }
        const data = await res.json();
        // update progress from server-provided progress if present
        if (typeof data.progress === 'number') {
          setProgress(data.progress);
        } else {
          // fallback mapping from state
          if (data.state === 'loading') setProgress((p) => Math.min(95, Math.max(p, 50)));
          if (data.state === 'loaded') setProgress(100);
        }

        if (data.state === 'loaded') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setIsLoading(false);
          setError('');
        } else if (data.state === 'error') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setIsLoading(false);
          setError(data.error || 'Error loading model');
        }
      } catch (err) {
        console.error('Polling error', err);
        // keep trying (or add retry/backoff logic)
      }
    }, 1000); // poll every 1s
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    // cleanup on unmount
    return () => stopPolling();
  }, []);

  const handleRunClick = async () => {
    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setError('');

    try {
      const response = await fetch(BACKEND_URL + 'run-model/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_model: selectedModel }),
      });

      // If server returned 202 Accepted or 200, start polling status
      if (response.status === 202 || response.ok) {
        startPolling();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to start model');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error while sending request:', err);
      setError('Network error while starting model');
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
          <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'green', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ModelComponent;
