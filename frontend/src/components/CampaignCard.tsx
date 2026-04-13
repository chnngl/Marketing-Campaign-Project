import { Link } from "react-router-dom";
import type { Campaign } from "../types/models";
import { formatDate } from "../utils/formatDate";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h2>{campaign.name}</h2>
      <p>
        <strong>Status:</strong> {campaign.status}
      </p>
      <p>
        <strong>Platform:</strong> {campaign.platform}
      </p>
      <p>
        <strong>Created:</strong> {formatDate(campaign.created_at)}
      </p>
      <p>{campaign.description}</p>

      <div>
        <strong>Events:</strong>
        {campaign.events.length === 0 ? (
          <p>No associated events.</p>
        ) : (
          <ul>
            {campaign.events.map((event) => (
              <li key={event.id}>
                {event.name} — {formatDate(event.event_date)} — {event.location}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to={`/landing/${campaign.slug}`}>View Landing Page</Link>
    </div>
  );
}