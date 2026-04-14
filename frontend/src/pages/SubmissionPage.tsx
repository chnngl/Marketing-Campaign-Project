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
    return <p>Loading submissions...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Submissions</h1>
      <button
        onClick={handleDownloadCsv}
        style={{
          marginBottom: "1rem",
          padding: "0.6rem 1rem",
          cursor: "pointer",
        }}
      >
        Download CSV
      </button>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
            <thead>
            <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Company</th>
              <th style={cellStyle}>Campaign</th>
              <th style={cellStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td style={cellStyle}>
                  {submission.first_name} {submission.last_name}
                </td>
                <td style={cellStyle}>{submission.email}</td>
                <td style={cellStyle}>{submission.company}</td>
                <td style={cellStyle}>{submission.campaign_name}</td>
                <td style={cellStyle}>{formatDate(submission.submitted_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "0.75rem",
  textAlign: "left",
};