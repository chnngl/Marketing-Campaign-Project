import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import type { Campaign } from "../types/models";

interface LandingFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [formData, setFormData] = useState<LandingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    async function loadCampaign() {
      try {
        const data = await apiFetch<Campaign[]>("/campaigns");
        const matchedCampaign = data.find((item) => item.slug === slug);

        if (!matchedCampaign) {
          setPageError("Campaign not found");
        } else {
          setCampaign(matchedCampaign);
        }
      } catch (err) {
        if (err instanceof Error) {
          setPageError(err.message);
        } else {
          setPageError("Failed to load campaign");
        }
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [slug]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!slug) {
      setSubmitError("Missing campaign slug");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");
    try {
      const response = await apiFetch<{ message: string }>(
        `/landing/${slug}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      setSubmitMessage(response.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) {
    return <p>Loading landing page...</p>;
  }
  if (pageError) {
    return <p>Error: {pageError}</p>;
  }
  if (!campaign) {
    return <p>Campaign not found.</p>;
  }

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>
  {campaign.name}</h1>
      <p>{campaign.description}</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "0.75rem",
          marginTop: "1.5rem",
        }}
      >
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {submitMessage && <p style={{ marginTop: "1rem" }}>{submitMessage}</p>}
      {submitError && <p style={{ marginTop: "1rem" }}>Error: {submitError}</p>}
    </div>
  );
}