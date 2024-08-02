
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError("Invalid JSON format. 'data' must be an array.");
        return;
      }

      const response = await axios.post("https://bfhl-api.herokuapp.com/bfhl", parsedData);
      setResponseData(response.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON input.");
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_alphabet } = responseData;

    const selectedData = {
      Alphabets: alphabets,
      Numbers: numbers,
      "Highest Alphabet": highest_alphabet,
    };

    return selectedOptions.map((option) => (
      <div key={option}>
        <h4>{option}</h4>
        <pre>{JSON.stringify(selectedData[option], null, 2)}</pre>
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>BFHL Frontend</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON input, e.g., { "data": ["A", "C", "z"] }'
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {responseData && (
        <>
          <h3>Response:</h3>
          <label>
            <input
              type="checkbox"
              value="Alphabets"
              checked={selectedOptions.includes("Alphabets")}
              onChange={handleOptionChange}
            />
            Alphabets
          </label>
          <label>
            <input
              type="checkbox"
              value="Numbers"
              checked={selectedOptions.includes("Numbers")}
              onChange={handleOptionChange}
            />
            Numbers
          </label>
          <label>
            <input
              type="checkbox"
              value="Highest Alphabet"
              checked={selectedOptions.includes("Highest Alphabet")}
              onChange={handleOptionChange}
            />
            Highest Alphabet
          </label>

          <div>{renderResponse()}</div>
        </>
      )}
    </div>
  );
}

export default App;
