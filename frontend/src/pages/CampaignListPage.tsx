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
    //console.log("useEffect started");
    async function loadCampaigns() {
      //console.log("loadCampaigns called");
      try {
        const data = await apiFetch<Campaign[]>("/campaigns");
        //console.log("campaign data:", data);
        setCampaigns(data);
      } catch (err) {
        //console.error("loadCampaigns error:", err);
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
    return <p className="text-slate-600">Loading campaigns...</p>;
  }
  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }
  return (
    <div>
      <h1 className="mb-8 text-5xl font-semibold tracking-tight text-green-950">
        Campaigns
      </h1>
      <div className="space-y-6">
        {campaigns.length === 0 ? (
          <p className="text-slate-600">No campaigns found.</p>
        ) : (
          campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        )}
      </div>
    </div>
  );
}