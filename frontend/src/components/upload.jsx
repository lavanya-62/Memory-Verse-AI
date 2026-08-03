import { useState } from "react";
import axios from "axios";
import "./Upload.css";

const API = "http://127.0.0.1:8000";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      setAnalysis(null);

      const response = await axios.post(
        `${API}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Upload Successful!");
      setAnalysis(response.data.analysis);

      console.log(response.data);

    } catch (err) {
      console.error(err);

      if (err.response) {
        setMessage(
          err.response.data.error || "Upload Failed!"
        );
      } else {
        setMessage("Server not responding.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>📤 Upload Document</h1>

      <div className="upload-card">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className="upload-message">
            {message}
          </p>
        )}

        {analysis && (
          <div className="analysis-result">
            <h3>Analysis Result</h3>

            <p>
              <b>Document Type:</b>{" "}
              {analysis.document_type}
            </p>

            <p>
              <b>Summary:</b>{" "}
              {analysis.summary}
            </p>

            <p>
              <b>Skills:</b>{" "}
              {analysis.skills?.join(", ")}
            </p>

            <p>
              <b>Projects:</b>{" "}
              {analysis.projects?.length > 0
                ? analysis.projects.join(", ")
                : "No Projects"}
            </p>

            <p>
              <b>Certifications:</b>{" "}
              {analysis.certifications?.length > 0
                ? analysis.certifications.join(", ")
                : "No Certifications"}
            </p>

            <p>
              <b>Achievements:</b>{" "}
              {analysis.achievements?.length > 0
                ? analysis.achievements.join(", ")
                : "No Achievements"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;