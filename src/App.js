import React, { useState } from "react";
import axios from "axios";
import "./App.css"

const App = () => {
  // States to manage user input, API response, and selected options
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError("");
  };

  // Handle submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError("Invalid JSON format or missing 'data' array.");
        setLoading(false);
        return;
      }

      // Call the backend API
      const res = await axios.post("http://localhost:3000/bfhl", parsedData);
      setResponse(res.data);
    } catch (err) {
      setError("Error: Invalid JSON or API request failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle multi-select dropdown change
  const handleDropdownChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(selected);
  };

  // Filter the response based on selected options
  const getFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.includes("Highest lowercase alphabet")) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return filteredResponse;
  };

  return (
    <div className="App">
      <h1>{response ? response.roll_number : "ABCD123"}</h1>
      
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter JSON here"
          value={jsonInput}
          onChange={handleInputChange}
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Dropdown to select what part of the response to show */}
      {response && !error && (
        <div>
          <h3>Select fields to display:</h3>
          <select multiple={true} value={selectedOptions} onChange={handleDropdownChange} style={{ width: "200px", height: "100px" }}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      {/* Display the filtered response */}
      {response && !error && selectedOptions.length > 0 && (
        <div>
          <h2>Filtered Response:</h2>
          <pre>{JSON.stringify(getFilteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;