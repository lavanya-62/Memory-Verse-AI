import { useEffect, useState } from "react";
import axios from "axios";
import "./Analysis.css";

function Analysis() {

  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/documents"
      );

      setDocuments(res.data);

      if (res.data.length > 0) {
        setSelectedDoc(res.data[0].id);
      }

    } catch (err) {
      console.log(err);
    }

  };

  const analyzeDocument = () => {

    setLoading(true);

    const doc = documents.find(
      (item) => item.id === selectedDoc
    );

    if (doc) {
      setAnalysis(doc);
    }

    setLoading(false);

  };

  return (

    <div className="analysis-page">

      <h1>🤖 AI Document Analysis</h1>

      <div className="analysis-top">

        <select
          value={selectedDoc}
          onChange={(e) =>
            setSelectedDoc(Number(e.target.value))
          }
        >

          {documents.map((doc) => (

            <option
              key={doc.id}
              value={doc.id}
            >
              {doc.filename}
            </option>

          ))}

        </select>

        <button onClick={analyzeDocument}>
          Analyze
        </button>

      </div>

      {loading && (
        <h2 className="loading">
          Analyzing...
        </h2>
      )}

      {analysis && (

        <div className="analysis-grid">

          <div className="analysis-card">

            <h3>📄 Document Type</h3>

            <p>{analysis.document_type}</p>

          </div>

          <div className="analysis-card">

            <h3>📝 Summary</h3>

            <p>{analysis.summary}</p>

          </div>

          <div className="analysis-card">

            <h3>🧠 Skills</h3>

            <div className="chips">

              {analysis.skills?.length > 0 ? (

                analysis.skills.map((skill, index) => (

                  <span
                    key={index}
                    className="chip"
                  >
                    {skill}
                  </span>

                ))

              ) : (

                <p>No Skills Found</p>

              )}

            </div>

          </div>

          <div className="analysis-card">

            <h3>💼 Projects</h3>

            <ul>

              {analysis.projects?.length > 0 ? (

                analysis.projects.map((project, index) => (

                  <li key={index}>

                    {typeof project === "string"
                      ? project
                      : project.title}

                  </li>

                ))

              ) : (

                <li>No Projects</li>

              )}

            </ul>

          </div>

          <div className="analysis-card">

            <h3>🏆 Certifications</h3>

            <ul>

              {analysis.certifications?.length > 0 ? (

                analysis.certifications.map((item, index) => (

                  <li key={index}>{item}</li>

                ))

              ) : (

                <li>No Certifications</li>

              )}

            </ul>

          </div>

          <div className="analysis-card">

            <h3>💼 Internships</h3>

            <ul>

              {analysis.internships?.length > 0 ? (

                analysis.internships.map((item, index) => (

                  <li key={index}>{item}</li>

                ))

              ) : (

                <li>No Internships</li>

              )}

            </ul>

          </div>

          <div className="analysis-card">

            <h3>🏅 Achievements</h3>

            <ul>

              {analysis.achievements?.length > 0 ? (

                analysis.achievements.map((item, index) => (

                  <li key={index}>{item}</li>

                ))

              ) : (

                <li>No Achievements</li>

              )}

            </ul>

          </div>

        </div>

      )}

    </div>

  );

}

export default Analysis;