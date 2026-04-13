import {Router, Request, Response} from "express";
import {db} from "../db/connection";
import { Campaign, Event, CampaignWithEvents } from "../types/models";

const router = Router();
router.get("/", (_req: Request, res: Response) => {
    const campaigns = db.prepare("SELECT * FROM campaigns ORDER BY id").all() as Campaign[];
    const events = db.prepare("SELECT * FROM events ORDER BY event_date").all() as Event[];
    const result: CampaignWithEvents[] = campaigns.map((campaign) => ({
    ...campaign,
    events: events.filter((event) => event.campaign_id === campaign.id),
  }));
  res.json(result);
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