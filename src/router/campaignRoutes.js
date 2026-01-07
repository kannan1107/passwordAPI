const express = require('express');
const { createEmailCampaign } = require('../config/brevo');
const router = express.Router();

router.post('/create-campaign', async (req, res) => {
  try {
    const campaignData = {
      name: req.body.name || "Campaign sent via API",
      subject: req.body.subject || "My subject",
      sender: req.body.sender || { name: "From name", email: "myfromemail@mycompany.com" },
      htmlContent: req.body.htmlContent || 'Congratulations! You successfully sent this example campaign via the Brevo API.',
      recipients: req.body.recipients || { listIds: [2, 7] },
      scheduledAt: req.body.scheduledAt
    };

    const result = await createEmailCampaign(campaignData);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;