import { Link } from "react-router-dom";
import type { Campaign, SendEmailResponse } from "../types/models";
import { formatDate } from "../utils/formatDate";
import { useState } from "react";
import { apiFetch } from "../services/api";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
    const [showSendModal, setShowSendModal] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [sendMessage, setSendMessage] = useState("");
    const [sendError, setSendError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    async function handleSendEmail() {
    setSending(true);
    setSendMessage("");
    setSendError("");
    setPreviewUrl("");
    try {
      const response = await apiFetch<SendEmailResponse>(
        `/campaigns/${campaign.id}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail,
          }),
        }
      );
      setSendMessage(response.message);
      setPreviewUrl(response.previewUrl ?? "");
      setRecipientEmail("");
    } catch (err) {
      if (err instanceof Error) {
        setSendError(err.message);
      } else {
        setSendError("Failed to send email");
      }
    } finally {
      setSending(false);
    }
  }
   function openModal() {
    setShowSendModal(true);
    setSendMessage("");
    setSendError("");
    setPreviewUrl("");
  }
  function closeModal() {
    setShowSendModal(false);
    setRecipientEmail("");
    setSendMessage("");
    setSendError("");
    setPreviewUrl("");
  }
  return (
    <>
      <article className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-3xl font-semibold text-green-950">
          {campaign.name}
        </h2>

        <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-600">
          <span>
            <span className="font-semibold text-slate-900">Status:</span>{" "}
            {campaign.status}
          </span>
          <span>
            <span className="font-semibold text-slate-900">Platform:</span>{" "}
            {campaign.platform}
          </span>
          <span>
            <span className="font-semibold text-slate-900">Created:</span>{" "}
            {formatDate(campaign.created_at)}
          </span>
        </div>

        <p className="mb-6 max-w-4xl leading-7 text-slate-700">
          {campaign.description}
        </p>

        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-900">
          Events
        </div>

        {campaign.events.length === 0 ? (
          <p className="mb-6 text-slate-600">No associated events.</p>
        ) : (
          <div className="mb-6 space-y-3">
            {campaign.events.map((event, index) => (
              <div
                key={event.id}
                className="rounded-xl border border-green-100 bg-green-50 p-4"
              >
                <div className="font-medium text-slate-900">
                  {index + 1}. {event.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {event.location} · {formatDate(event.event_date)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/landing/${campaign.slug}`}
            className="inline-flex rounded-xl bg-green-100 px-4 py-2 font-medium text-green-900 transition hover:bg-green-200"
          >
            View Landing Page
          </Link>

          <button
            type="button"
            onClick={openModal}
            className="rounded-xl bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800"
          >
            Send Email
          </button>
        </div>
      </article>

      {showSendModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">
                Send Campaign Email
              </h3>
              <button
                className="text-2xl leading-none text-slate-500 hover:text-slate-800"
                type="button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <input
              type="email"
              placeholder="Recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mb-3 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 placeholder:text-slate-400 focus:border-green-500"
            />

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={sending || !recipientEmail.trim()}
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send"}
            </button>

            {sendMessage && (
              <p className="mt-3 text-sm text-green-700">{sendMessage}</p>
            )}
            {sendError && (
              <p className="mt-3 text-sm text-red-600">Error: {sendError}</p>
            )}
            {previewUrl && (
              <p className="mt-3 text-sm">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-800 underline"
                >
                  Open Ethereal Preview
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}