import React, { useEffect, useState } from "react";
import api from "../api";

import { Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaFileAlt,
  FaBrain,
  FaProjectDiagram,
  FaCertificate,
  FaRobot,
  FaLightbulb,
  FaChartPie,
  FaChartBar,
  FaFilePdf,
  FaTable,
} from "react-icons/fa";

import jsPDF from "jspdf";

import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSkills: 0,
    totalProjects: 0,
    totalCertificates: 0,
    totalAchievements: 0,
    resumeCount: 0,
    otherCount: 0,
  });

  const [topSkills, setTopSkills] = useState([]);

  const [recentDocuments, setRecentDocuments] = useState([]);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const response = await api.get("/dashboard")
  
      

      const data = response.data;

      setStats({

        totalDocuments: data.total_documents,

        totalSkills: data.total_skills,

        totalProjects: data.total_projects,

        totalCertificates: data.total_certifications,

        totalAchievements: data.total_achievements,

        resumeCount: data.resume_count,

        otherCount: data.other_documents,

      });

      const skills = data.top_skills.map(([name, count]) => ({
        name,
        count,
      }));

      setTopSkills(skills);

      setRecentDocuments(data.recent_documents);

      setError("");

    } catch (err) {

      console.log(err);

      setError("Unable to load dashboard.");

    } finally {

      setLoading(false);

    }

  };
    const pieData = {
    labels: ["Resume", "Other Documents"],
    datasets: [
      {
        data: [
          stats.resumeCount,
          stats.otherCount,
        ],
        backgroundColor: [
          "#6366F1",
          "#38BDF8",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const barData = {
    labels: [
      "Documents",
      "Skills",
      "Projects",
      "Certificates",
    ],

    datasets: [
      {
        label: "Count",

        data: [
          stats.totalDocuments,
          stats.totalSkills,
          stats.totalProjects,
          stats.totalCertificates,
        ],

        backgroundColor: [
          "#6366F1",
          "#8B5CF6",
          "#38BDF8",
          "#22D3EE",
        ],

        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const exportPDF = () => {

    const pdf = new jsPDF();

    pdf.setFontSize(18);

    pdf.text(
      "MemoryVerse AI Dashboard Report",
      20,
      20
    );

    pdf.setFontSize(12);

    pdf.text(
      `Total Documents : ${stats.totalDocuments}`,
      20,
      40
    );

    pdf.text(
      `Total Skills : ${stats.totalSkills}`,
      20,
      50
    );

    pdf.text(
      `Total Projects : ${stats.totalProjects}`,
      20,
      60
    );

    pdf.text(
      `Total Certifications : ${stats.totalCertificates}`,
      20,
      70
    );

    pdf.text(
      `Resume Count : ${stats.resumeCount}`,
      20,
      80
    );

    pdf.text(
      `Other Documents : ${stats.otherCount}`,
      20,
      90
    );

    pdf.text(
      "Top Skills",
      20,
      110
    );

    topSkills.forEach((skill, index) => {

      pdf.text(

        `${index + 1}. ${skill.name} (${skill.count})`,

        25,

        122 + index * 10

      );

    });

    pdf.save("MemoryVerse_Report.pdf");

  };

  if (loading) {

    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );

  }

  if (error) {

    return (
      <div className="dashboard-loading">
        <h2>{error}</h2>
      </div>
    );

  }
    return (
    <div className="dashboard-container">

      <div className="dashboard-header">

        <div>

          <h1 className="dashboard-title">

            <FaRobot className="title-icon" />

            MemoryVerse AI Dashboard

          </h1>

          <p className="dashboard-subtitle">

            AI Powered Intelligent Document Analysis

          </p>

        </div>

        <button
          className="export-btn"
          onClick={exportPDF}
        >
          <FaFilePdf />
          Export Report
        </button>

      </div>

      <div className="stats-grid">

        <div className="stat-card gradient-blue">

          <div className="stat-icon-wrapper">
            <FaFileAlt className="stat-icon" />
          </div>

          <div className="stat-info">
            <h2>{stats.totalDocuments}</h2>
            <p>Total Documents</p>
          </div>

        </div>

        <div className="stat-card gradient-purple">

          <div className="stat-icon-wrapper">
            <FaBrain className="stat-icon" />
          </div>

          <div className="stat-info">
            <h2>{stats.totalSkills}</h2>
            <p>Total Skills</p>
          </div>

        </div>

        <div className="stat-card gradient-cyan">

          <div className="stat-icon-wrapper">
            <FaProjectDiagram className="stat-icon" />
          </div>

          <div className="stat-info">
            <h2>{stats.totalProjects}</h2>
            <p>Total Projects</p>
          </div>

        </div>

        <div className="stat-card gradient-indigo">

          <div className="stat-icon-wrapper">
            <FaCertificate className="stat-icon" />
          </div>

          <div className="stat-info">
            <h2>{stats.totalCertificates}</h2>
            <p>Certificates</p>
          </div>

        </div>

      </div>

      <div className="charts-grid">

        <div className="chart-card">

          <h3 className="chart-title">

            <FaChartPie />

            Document Types

          </h3>

          <div className="chart-wrapper">

            <Pie
              data={pieData}
              options={pieOptions}
            />

          </div>

        </div>

        <div className="chart-card">

          <h3 className="chart-title">

            <FaChartBar />

            Overview Summary

          </h3>

          <div className="chart-wrapper">

            <Bar
              data={barData}
              options={barOptions}
            />

          </div>

        </div>

      </div>
            <div className="insights-section">

        <h2 className="section-heading">

          <FaLightbulb />

          AI Insights

        </h2>

        <div className="insights-grid">

          <div className="insight-card">

            <h4>Total Documents</h4>

            <p className="insight-value">
              {stats.totalDocuments}
            </p>

            <span className="insight-label">
              Documents uploaded
            </span>

          </div>

          <div className="insight-card">

            <h4>Resume Files</h4>

            <p className="insight-value">
              {stats.resumeCount}
            </p>

            <span className="insight-label">
              Resume documents
            </span>

          </div>

          <div className="insight-card">

            <h4>Projects</h4>

            <p className="insight-value">
              {stats.totalProjects}
            </p>

            <span className="insight-label">
              AI detected projects
            </span>

          </div>

          <div className="insight-card">

            <h4>Certificates</h4>

            <p className="insight-value">
              {stats.totalCertificates}
            </p>

            <span className="insight-label">
              Certificates uploaded
            </span>

          </div>

        </div>

        <div className="skills-card">

          <h3>

            <FaBrain />

            Top Skills

          </h3>

          {

            topSkills.length > 0 ? (

              <ul className="skills-list">

                {topSkills.map((skill, index) => (

                  <li
                    key={index}
                    className="skill-item"
                  >

                    <span className="skill-rank">
                      #{index + 1}
                    </span>

                    <span className="skill-name">
                      {skill.name}
                    </span>

                    <span className="skill-count">
                      {skill.count}
                    </span>

                  </li>

                ))}

              </ul>

            ) : (

              <p>No Skills Found</p>

            )

          }

        </div>

      </div>

      <div className="recommendation-section">

        <div className="recommendation">

          <div className="recommendation-header">

            🤖 AI Recommendation

          </div>

          <p>

            Your strongest skill is{" "}

            <b>

              {topSkills[0]?.name || "your skills"}

            </b>

            .

            Build more real-world projects
            using this technology.

          </p>

          <div className="recommendation-tags">

            <span>🚀 React</span>

            <span>⚡ FastAPI</span>

            <span>🧠 AI</span>

            <span>🐍 Python</span>

            <span>☁ Cloud</span>

          </div>

        </div>

      </div>
            <div className="recent-documents-section">

        <h2 className="section-heading">

          <FaTable />

          Recent Documents

        </h2>

        <div className="table-wrapper">

          <table className="documents-table">

            <thead>

              <tr>

                <th>Filename</th>

                <th>Document Type</th>

              </tr>

            </thead>

            <tbody>

              {recentDocuments.length > 0 ? (

                recentDocuments.map((doc) => (

                  <tr key={doc.id}>

                    <td>

                      {doc.filename}

                    </td>

                    <td>

                      <span className="type-badge">

                        {doc.document_type || "Other"}

                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="2"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >

                    No Documents Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      <footer className="dashboard-footer">

        <p>

          ❤️ MemoryVerse AI

        </p>

        <p className="footer-subtext">

          Powered by React • FastAPI • Gemini AI • SQLite • ChromaDB

        </p>

      </footer>

    </div>

  );

};

export default Dashboard;