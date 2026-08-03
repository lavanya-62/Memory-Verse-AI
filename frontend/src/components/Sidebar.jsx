import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUpload,
  FaFolderOpen,
  FaSearch,
  FaRobot,
  FaBrain,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        <FaBrain size={35} />
        <h2>MemoryVerse AI</h2>
      </div>

      <nav>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaChartPie />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaUpload />
          <span>Upload</span>
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaFolderOpen />
          <span>Documents</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaSearch />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/ai-search"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaRobot />
          <span>AI Search</span>
        </NavLink>

      </nav>

    </div>
  );
}

export default Sidebar;