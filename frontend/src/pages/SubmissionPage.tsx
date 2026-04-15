import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../services/api";
import type { Submission } from "../types/models";
import { formatDate } from "../utils/formatDate";

const ITEMS_PER_PAGE = 8;

export default function SubmissionPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(submissions.length / ITEMS_PER_PAGE));
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return submissions.slice(startIndex, endIndex);
  }, [submissions, currentPage]);
  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }
  function goToNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }
  function goToPage(page: number) {
    setCurrentPage(page);
  }
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
        <>
          <div className="mb-4 text-sm text-slate-600">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, submissions.length)} of{" "}
            {submissions.length} submissions
          </div>
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
              {paginatedSubmissions.map((submission) => (
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-900 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = currentPage === pageNumber;
              return (
                <button
                  key={pageNumber}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "border border-green-300 bg-white text-green-900 hover:bg-green-50"
                  }`}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-900 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}