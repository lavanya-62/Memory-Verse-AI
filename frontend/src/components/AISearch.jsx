import { useState } from "react";
import api from "../api";
import "./AISearch.css";

function AISearch() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {

    if (!question.trim()) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true);

    try {

      const response = await api.get(
        `/ai-search?question=${encodeURIComponent(question)}`
      );

      setAnswer(response.data.answer);

    } catch (error) {

      console.log(error);
      setAnswer("Something went wrong.");

    }

    setLoading(false);

  };

  return (

    <div className="ai-search-page">

      <h2>🤖 AI Semantic Search</h2>

      <p className="subtitle">
        Ask questions about your uploaded documents.
      </p>

      <div className="ai-search-box">

        <input
          type="text"
          placeholder="Example: What skills does my resume contain?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={askAI}>
          Ask AI
        </button>

      </div>

      {loading && (

        <div className="loading">
          Thinking...
        </div>

      )}

      {answer && (

        <div className="answer-card">

          <h3>💡 AI Answer</h3>

          <p>{answer}</p>

        </div>

      )}

    </div>

  );

}

export default AISearch;