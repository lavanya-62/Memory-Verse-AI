import { useState } from "react";
import api from "../api";
import "./Search.css";

function Search() {

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const searchDocuments = async () => {

    if (!keyword.trim()) {
      alert("Enter a keyword");
      return;
    }

    try {

      const response = await api.get(
        `/search?keyword=${encodeURIComponent(keyword)}`
      );

      setResults(response.data.results);

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="search-page">

      <h2>🔍 Keyword Search</h2>

      <div className="search-box">

        <input
          type="text"
          placeholder="Enter skill, project or certificate..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={searchDocuments}>
          Search
        </button>

      </div>

      <div className="results">

        {results.length === 0 ? (

          <p>No Results</p>

        ) : (

          results.map((doc) => (

            <div
              className="result-card"
              key={doc.id}
            >

              <h3>{doc.filename}</h3>

              <p>
                <strong>Type:</strong> {doc.document_type}
              </p>

              <p>
                <strong>Summary:</strong> {doc.summary}
              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Search;