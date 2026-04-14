import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { SubmissionWithCampaign } from "../types/models";
import { toCsv } from "../utils/csv";

const router = Router();
router.get("/", (_req: Request, res: Response) => {
  const submissions = db.prepare(`
    SELECT
      s.id,
      s.campaign_id,
      s.first_name,
      s.last_name,
      s.email,
      s.company,
      s.submitted_at,
      c.name AS campaign_name
    FROM submissions s
    JOIN campaigns c ON s.campaign_id = c.id
    ORDER BY s.submitted_at DESC
  `).all() as SubmissionWithCampaign[];
  return res.json(submissions);
});
router.get("/export", (_req: Request, res: Response) => {
  const submissions = db.prepare(`
    SELECT
      s.id,
      s.first_name,
      s.last_name,
      s.email,
      s.company,
      s.submitted_at,
      c.name AS campaign_name
    FROM submissions s
    JOIN campaigns c ON s.campaign_id = c.id
    ORDER BY s.submitted_at DESC
  `).all() as Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    submitted_at: string;
    campaign_name: string;
  }>;

  const csv = toCsv(submissions);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="submissions.csv"');
  return res.status(200).send(csv);
});
export default router;