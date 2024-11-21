import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState(""); // For input JSON
  const [response, setResponse] = useState(null); // For server response
  const [error, setError] = useState(""); // For errors
  const [selectedOption, setSelectedOption] = useState(""); // For dropdown selection
  const [loading, setLoading] = useState(false); // For loading state

  // Handle changes in the textarea
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Parse the input JSON or use an empty object
      const parsedData = jsonInput ? JSON.parse(jsonInput) : {};
      // Send the parsed data to the /bfhl route
      const res = await axios.post("https://bajaj-backend-1-hf1v.onrender.com/bfhl", parsedData);
      setResponse(res.data);
    } catch (err) {
      setError("Error: Invalid JSON or API request failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown option change
  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Filter response based on the selected dropdown option
  const getFilteredResponse = () => {
    if (!response || !selectedOption) return null;
    const keyMap = {
      Alphabets: "alphabets",
      Numbers: "numbers",
      "Highest lowercase alphabet": "highest_lowercase_alphabet",
    };
    return { [keyMap[selectedOption]]: response[keyMap[selectedOption]] };
  };

  return (
    <div className="App">
      <div className="main_block">
      <h1>Data Filter Application</h1>
      <p className="User">Completed By: Mitali Singh ({response? response.roll_number:"0827CI211110"})</p>
      <form onSubmit={handleSubmit} className="form-section">
        <textarea
          placeholder='Enter JSON here (e.g., {"data": ["a", 1, "b", 2]})'
          value={jsonInput}
          onChange={handleInputChange}
          rows="8"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      </div>
      {error && <p className="error-message">{error}</p>}

      {/* Dropdown and filtered response */}
      {response && !error && (
        <div className="filter">
          <h3>Filter Response:</h3>
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="dropdown"
          >
            <option value="" disabled>
              Select a filter
            </option>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">
              Highest lowercase alphabet
            </option>
          </select>
          {selectedOption && (
            <div className="response-section">
              <h2>Filtered Response:</h2>
              <pre>{JSON.stringify(getFilteredResponse(), null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;