import {BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CampaignListPage from './pages/CampaignListPage';
import LandingPage from './pages/LandingPage';
import SubmissionPage from './pages/SubmissionPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-green-50 text-slate-800">
        <header className="border-b border-green-100 bg-gradient-to-r from-green-800 to-emerald-200">
          <div className="mx-auto flex max-w-6xl justify-end gap-6 px-6 py-4">
            <Link
              to="/"
              className="font-medium text-green-800 transition hover:text-green-950"
            >
              Campaigns
            </Link>
            <Link
              to="/submissions"
              className="font-medium text-green-800 transition hover:text-green-950"
            >
              Submissions
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">
          <Routes>
            <Route path="/" element={<CampaignListPage />} />
            <Route path="/landing/:slug" element={<LandingPage />} />
            <Route path="/submissions" element={<SubmissionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
