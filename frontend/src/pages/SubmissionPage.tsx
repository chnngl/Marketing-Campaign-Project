import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { Submission } from "../types/models";
import { formatDate } from "../utils/formatDate";

export default function SubmissionPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const data = await apiFetch<Submission[]>("/submissions");
        setSubmissions(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load submissions");
        }
      } finally {
        setLoading(false);
      }
    }
    loadSubmissions();
  }, []);

  function handleDownloadCsv() {
    window.open("http://localhost:4000/api/submissions/export", "_blank");
  }
  if (loading) {
    return <p className="text-slate-600">Loading submissions...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-5xl font-semibold tracking-tight text-green-950">
          Submissions
        </h1>

        <button
          className="rounded-xl bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800"
          onClick={handleDownloadCsv}
        >
          Download CSV
        </button>
      </div>

      {submissions.length === 0 ? (
        <p className="text-slate-600">No submissions found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-green-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-950">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-950">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-950">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-950">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-950">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-green-100">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {submission.first_name} {submission.last_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {submission.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {submission.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {submission.campaign_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {formatDate(submission.submitted_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}