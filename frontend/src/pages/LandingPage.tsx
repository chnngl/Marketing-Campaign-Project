import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import type { Campaign } from "../types/models";
import type { ChangeEvent, SubmitEvent} from "react";


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
        //fetch campaign and match by slug
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
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
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
    return <p className="text-slate-600">Loading landing page...</p>;
  }
  if (pageError) {
    return <p className="text-red-600">Error: {pageError}</p>;
  }
  if (!campaign) {
    return <p className="text-slate-600">Campaign not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-green-200 bg-white p-8 shadow-sm">
      <h1 className="mb-4 text-4xl font-semibold leading-tight text-green-950">
        {campaign.name}
      </h1>
      <p className="mb-6 leading-7 text-slate-700">{campaign.description}</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-green-500"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-green-500"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-green-500"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-green-500"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <button
          className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {submitMessage && (
        <p className="mt-4 text-sm text-green-700">{submitMessage}</p>
      )}
      {submitError && (
        <p className="mt-4 text-sm text-red-600">Error: {submitError}</p>
      )}
    </div>
  );
}