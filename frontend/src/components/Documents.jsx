
import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function Documents() {

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  // ==========================
  // Load Documents
  // ==========================

  const loadDocuments = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/documents"
      );

      setDocuments(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // View Analysis
  // ==========================

  const viewAnalysis = async (id) => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/analyze/${id}`
      );

      setSelectedDocument(response.data);

    } catch (error) {

      console.log(error);

      alert("Unable to load analysis.");

    }

  };

  // ==========================
  // Delete Document
  // ==========================

  const deleteDocument = async (id) => {

    if (!window.confirm("Delete this document?")) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/documents/${id}`
      );

      await loadDocuments();

      setSelectedDocument(null);

      alert("Document Deleted Successfully!");

    } catch (error) {

      console.log(error);

      alert("Delete Failed!");

    }

  };

  // ==========================
  // Download PDF
  // ==========================

  const downloadPDF = (doc) => {

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(20);
    pdf.text("MemoryVerse AI Report", 20, y);

    y += 15;

    pdf.setFontSize(12);

    pdf.text(`Filename: ${doc.filename}`, 20, y);

    y += 10;

    pdf.text(`Document Type: ${doc.document_type}`, 20, y);

    y += 15;

    pdf.setFontSize(14);
    pdf.text("Summary", 20, y);

    y += 10;

    pdf.setFontSize(11);

    const summary = pdf.splitTextToSize(
      doc.summary || "No Summary",
      170
    );

    pdf.text(summary, 20, y);

    y += summary.length * 7 + 10;
        pdf.setFontSize(14);
    pdf.text("Skills", 20, y);

    y += 10;

    pdf.setFontSize(11);

    if (doc.skills?.length === 0) {

      pdf.text("No Skills", 25, y);

      y += 10;

    } else {

      doc.skills?.forEach((skill) => {

        pdf.text("• " + skill, 25, y);

        y += 8;

      });

    }

    y += 5;

    pdf.setFontSize(14);
    pdf.text("Projects", 20, y);

    y += 10;

    pdf.setFontSize(11);

    if (doc.projects?.length === 0) {

      pdf.text("No Projects", 25, y);

      y += 10;

    } else {

      doc.projects?.forEach((project) => {

        if (typeof project === "string") {

          pdf.text("• " + project, 25, y);

          y += 8;

        } else {

          pdf.text("• " + project.title, 25, y);

          y += 8;

          const desc = pdf.splitTextToSize(
            project.description || "",
            160
          );

          pdf.text(desc, 30, y);

          y += desc.length * 7 + 5;

        }

      });

    }

    pdf.setFontSize(14);
    pdf.text("Certifications", 20, y);

    y += 10;

    pdf.setFontSize(11);

    if (doc.certifications?.length === 0) {

      pdf.text("No Certifications", 25, y);

      y += 10;

    } else {

      doc.certifications?.forEach((item) => {

        pdf.text("• " + item, 25, y);

        y += 8;

      });

    }

    pdf.setFontSize(14);
    pdf.text("Achievements", 20, y);

    y += 10;

    pdf.setFontSize(11);

    if (doc.achievements?.length === 0) {

      pdf.text("No Achievements", 25, y);

    } else {

      doc.achievements?.forEach((item) => {

        pdf.text("• " + item, 25, y);

        y += 8;

      });

    }

    pdf.save(
      doc.filename.replace(".pdf", "") + "_Report.pdf"
    );

  };

  return (

    <div className="card">

      <h2>📁 Uploaded Documents</h2>

      {loading ? (

        <h3>Loading Documents...</h3>

      ) : (

        <table style={{ width: "100%" }}>

          <thead>

            <tr>

              <th>Filename</th>

              <th>Document Type</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {documents.map((doc) => (

              <tr key={doc.id}>

                <td>{doc.filename}</td>

                <td>{doc.document_type}</td>

                <td>

                  <button
                    onClick={() => viewAnalysis(doc.id)}
                    style={{
                      background: "#16a34a",
                      marginRight: "8px",
                    }}
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadPDF(doc)}
                    style={{
                      background: "#f59e0b",
                      marginRight: "8px",
                    }}
                  >
                    Download
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    style={{
                      background: "#dc2626",
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}
            {selectedDocument && (

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fafafa",
          }}
        >

          <h2>📄 AI Document Analysis</h2>

          <p>
            <strong>Filename:</strong>{" "}
            {selectedDocument.filename}
          </p>

          <p>
            <strong>Document Type:</strong>{" "}
            {selectedDocument.document_type}
          </p>

          <p>
            <strong>Summary:</strong>{" "}
            {selectedDocument.summary}
          </p>

          <h3>🧠 Skills</h3>

          <ul>

            {selectedDocument.skills?.length === 0 ? (

              <li>No Skills Found</li>

            ) : (

              selectedDocument.skills?.map((skill, index) => (

                <li key={index}>{skill}</li>

              ))

            )}

          </ul>

          <h3>💼 Projects</h3>

          <ul>

            {selectedDocument.projects?.length === 0 ? (

              <li>No Projects Found</li>

            ) : (

              selectedDocument.projects?.map((project, index) => (

                <li key={index}>

                  {typeof project === "string" ? (
                    project
                  ) : (
                    <>
                      <strong>{project.title}</strong>
                      <br />
                      {project.description}
                    </>
                  )}

                </li>

              ))

            )}

          </ul>

          <h3>🏆 Certifications</h3>

          <ul>

            {selectedDocument.certifications?.length === 0 ? (

              <li>No Certifications</li>

            ) : (

              selectedDocument.certifications?.map((item, index) => (

                <li key={index}>{item}</li>

              ))

            )}

          </ul>

          <h3>🎖 Achievements</h3>

          <ul>

            {selectedDocument.achievements?.length === 0 ? (

              <li>No Achievements</li>

            ) : (

              selectedDocument.achievements?.map((item, index) => (

                <li key={index}>{item}</li>

              ))

            )}

          </ul>

        </div>

      )}

    </div>

  );

}

export default Documents;