import { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import { apiFetch } from "../services/api";
import type { Campaign } from "../types/models";

export default function CampaignListPage() {
    console.log("CampaignListPage rendered");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect started");
    async function loadCampaigns() {
        console.log("loadCampaigns called");
      try {
        const data = await apiFetch<Campaign[]>("/campaigns");
        console.log("campaign data:", data);
        setCampaigns(data);
      } catch (err) {
        console.error("loadCampaigns error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load campaigns");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, []);

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))
      )}
    </div>
  );
}