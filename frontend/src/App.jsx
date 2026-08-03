import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import Documents from "./components/Documents";
import Analysis from "./components/Analysis";
import Search from "./components/Search";
import AISearch from "./components/AISearch";

import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ai-search" element={<AISearch />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;