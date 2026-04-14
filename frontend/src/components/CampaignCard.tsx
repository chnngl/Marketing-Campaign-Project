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
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h2 style={{ marginTop: 0 }}>{campaign.name}</h2>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
        textAlign: "center",
        }}
        >
            <span>
                <strong>Status:</strong> {campaign.status}
            </span>
            <span>
                <strong>Platform:</strong> {campaign.platform}
            </span>
            <span>
            <strong>Created:</strong> {formatDate(campaign.created_at)}
            </span>
        </div>
        <p style={{maxWidth: "1100px", margin: "1rem 5rem 1rem", textAlign: "justify", lineHeight: 1.6,}}>
            {campaign.description}
        </p>
      <div>
        <strong>Events:</strong>
        {campaign.events.length === 0 ? (
          <p>No associated events.</p>
        ) : (
          <div style={{ marginTop: "0.5rem" }}>
            {campaign.events.map((event, index) => (
                <p key={event.id} style={{ margin: "0.35rem 0" }}>
                    {index + 1}. {event.name} — {event.location} — {formatDate(event.event_date)}
                </p>
            ))}
            </div>
        )}
        </div>
      <div
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
      <Link to={`/landing/${campaign.slug}`}>View Landing Page</Link>
        </div>
        <button
            type="button"
            onClick={openModal}
            style={{
              padding: "0.5rem 0.9rem",
              cursor: "pointer",
            }}
          >
            Send Email
          </button>
        </div>
      {showSendModal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ margin: 0 }}>Send Campaign Email</h3>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <input
              type="email"
              placeholder="Recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "0.75rem",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={sending || !recipientEmail.trim()}
              style={{
                padding: "0.7rem 1rem",
                cursor: sending ? "default" : "pointer",
                width: "100%",
              }}
            >
              {sending ? "Sending..." : "Send"}
            </button>
        {sendMessage && <p style={{ marginTop: "0.75rem" }}>{sendMessage}</p>}
        {sendError && <p style={{ marginTop: "0.75rem" }}>Error: {sendError}</p>}
        {previewUrl && (
          <p style={{ marginTop: "0.75rem" }}>
            <a href={previewUrl} target="_blank" rel="noreferrer">
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