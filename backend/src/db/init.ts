import fs from "fs";
import path from "path";
import {db} from "./connection";
import {SeedData, Campaign, Event} from "../models/models";

export function createTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      email_subject TEXT NOT NULL,
      cta_text TEXT NOT NULL,
      status TEXT NOT NULL,
      platform TEXT NOT NULL,
      budget_usd REAL NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      campaign_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      event_date TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    );
  `);
}
export function seedDatabase(): void {
  const campaignCount = db.prepare("SELECT COUNT(*) as count FROM campaigns").get() as {
    count: number;
  };
  if (campaignCount.count > 0) {
    console.log("Database already seeded.");
    return;
  }
  const seedFilePath = path.join(process.cwd(), "data", "seed_campaigns.json");
  const raw = fs.readFileSync(seedFilePath, "utf-8");
  const seedData = JSON.parse(raw) as SeedData;
  const insertCampaign = db.prepare(`
    INSERT INTO campaigns (
      id, name, slug, description, email_subject, cta_text, status, platform, budget_usd, created_at
    ) VALUES (
      @id, @name, @slug, @description, @email_subject, @cta_text, @status, @platform, @budget_usd, @created_at
    )
  `);
  const insertEvent = db.prepare(`
    INSERT INTO events (
      id, campaign_id, name, event_date, location, capacity, description
    ) VALUES (
      @id, @campaign_id, @name, @event_date, @location, @capacity, @description
    )
  `);
  const transaction = db.transaction((campaigns: Campaign[], events: Event[]) => {
    for (const campaign of campaigns) {
      insertCampaign.run(campaign);
    }
    for (const event of events) {
      insertEvent.run(event);
    }
  });
  transaction(seedData.campaigns, seedData.events);
  console.log("Database seeded successfully.");
}