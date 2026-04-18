import { Router } from "express";
import { createEmailCampaign } from "../config/brevo.js";

const campaignRoutes = Router();

campaignRoutes.post("/create-campaign", async (req, res) => {
  try {
    const { name, subject, sender, htmlContent, recipients, scheduledAt } = req.body;

    if (!name || !subject || !sender || !htmlContent || !recipients) {
      return res.status(400).json({ success: false, error: "name, subject, sender, htmlContent and recipients are required" });
    }

    const result = await createEmailCampaign({ name, subject, sender, htmlContent, recipients, scheduledAt });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default campaignRoutes;
