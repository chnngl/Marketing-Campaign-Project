import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { Campaign, LandingSubmissionRequest } from "../types/models";
import { isNonEmptyString, isValidEmail } from "../utils/validation";

const router = Router();

router.post("/:slug/submit", (req: Request, res: Response) => {
  const { slug } = req.params;
  const body = req.body as Partial<LandingSubmissionRequest>;
  const campaign = db
    .prepare("SELECT * FROM campaigns WHERE slug = ?")
    .get(slug) as Campaign | undefined;
  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }
  if (
    !isNonEmptyString(body.firstName) ||
    !isNonEmptyString(body.lastName) ||
    !isNonEmptyString(body.email) ||
    !isNonEmptyString(body.company)
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValidEmail(body.email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  const submittedAt = new Date().toISOString();
  const insertSubmission = db.prepare(`
    INSERT INTO submissions (
      campaign_id,
      first_name,
      last_name,
      email,
      company,
      submitted_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = insertSubmission.run(
    campaign.id,
    body.firstName.trim(),
    body.lastName.trim(),
    body.email.trim().toLowerCase(),
    body.company.trim(),
    submittedAt
  );
  return res.status(201).json({
    message: "Submission saved successfully",
    submissionId: result.lastInsertRowid,
  });
});
export default router;