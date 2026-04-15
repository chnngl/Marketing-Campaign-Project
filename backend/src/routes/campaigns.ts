import {Router, Request, Response} from "express";
import {db} from "../db/connection";
import { Campaign, Event, CampaignWithEvents } from "../types/models";
import { isNonEmptyString, isValidEmail } from "../utils/validation";
import { sendCampaignEmail } from "../services/emailService";
import { SendCampaignEmailRequest } from "../types/models";

const router = Router();

//return campaigns with their associated events
router.get("/", (_req: Request, res: Response) => {
    const campaigns = db.prepare("SELECT * FROM campaigns ORDER BY id").all() as Campaign[];
    const events = db.prepare("SELECT * FROM events ORDER BY event_date").all() as Event[];
    const result: CampaignWithEvents[] = campaigns.map((campaign) => ({
    ...campaign,
    events: events.filter((event) => event.campaign_id === campaign.id),
  }));
  res.json(result);
});

router.post("/:id/send", async (req: Request, res: Response) => {
  const campaignId = Number(req.params.id);
  const body = req.body as Partial<SendCampaignEmailRequest>;
  if (Number.isNaN(campaignId)) {
    return res.status(400).json({ message: "Invalid campaign id" });
  }
  if (!isNonEmptyString(body.recipientEmail)) {
    return res.status(400).json({ message: "Recipient email is required" });
  }
  if (!isValidEmail(body.recipientEmail)) {
    return res.status(400).json({ message: "Invalid recipient email" });
  }
  const campaign = db
    .prepare("SELECT * FROM campaigns WHERE id = ?")
    .get(campaignId) as Campaign | undefined;
  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }
  const landingPageUrl = `http://localhost:5173/landing/${campaign.slug}`;
  try {
    const result = await sendCampaignEmail({
      recipientEmail: body.recipientEmail,
      campaignName: campaign.name,
      emailSubject: campaign.email_subject,
      ctaText: campaign.cta_text,
      landingPageUrl,
      description: campaign.description,
    });
    return res.status(200).json({
      message: "Campaign email sent successfully",
      previewUrl: result.previewUrl,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({
      message: "Failed to send campaign email, please try again",
    });
  }
});

router.get("/:id",(req: Request, res: Response) =>{
    const campaignId = Number(req.params.id);
    if (Number.isNaN(campaignId)) {
    return res.status(400).json({ message: "Invalid campaign id" });
  }
  const campaign = db
    .prepare("SELECT * FROM campaigns WHERE id = ?")
    .get(campaignId) as Campaign | undefined;
  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }
  const events = db
    .prepare("SELECT * FROM events WHERE campaign_id = ? ORDER BY event_date")
    .all(campaignId) as Event[];
  const result: CampaignWithEvents = {
    ...campaign,
    events,
  };
  return res.json(result);
});
export default router;