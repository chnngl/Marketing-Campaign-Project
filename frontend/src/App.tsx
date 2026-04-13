import {BrowserRouter, Routes, Route, Link }from"react-router-dom";
import './App.css';
import CampaignListPage from './pages/CampaignListPage';
import LandingPage from './pages/LandingPage';
import SubmissionPage from './pages/SubmissionPage';

function App() {
  return (
    <BrowserRouter>
      <nav style = {{ padding:"1rem", display:"flex", gap:"1rem" }}>
        <Link to="/">Campaigns</Link>
        <Link to="/submissions">Submissions</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CampaignListPage/>} />
        <Route path="/landing/:slug" element={<LandingPage/>} />
        <Route path="/submissions" element={<SubmissionPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
