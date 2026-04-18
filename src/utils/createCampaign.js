import SibApiV3Sdk from 'sib-api-v3-sdk';

/**
 * Creates a marketing email campaign using the Brevo SDK.
 * @param {Object} params
 * @param {string} params.name - Internal name of the campaign.
 * @param {string} params.subject - Email subject line.
 * @param {string} params.htmlContent - The HTML body of the email.
 * @param {Array<number>} params.listIds - Array of list IDs to send to.
 */
const createCampaign = async ({ name, subject, htmlContent, listIds }) => {
  try {
    // Strip whitespace and accidental literal quotes
    const apiKeyString = process.env.BREVO_API_KEY?.trim().replace(/^["']|["']$/g, '');
    
    if (!apiKeyString) throw new Error("BREVO_API_KEY is missing.");
    if (!apiKeyString.startsWith("xkeysib-")) {
      throw new Error("Invalid BREVO_API_KEY format in Campaign utility. Ensure you use the v3 API Key.");
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    // Configure API key authentication
    defaultClient.authentications['api-key'].apiKey = apiKeyString;

    const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
    const emailCampaign = new SibApiV3Sdk.CreateEmailCampaign();

    // Campaign Configuration
    emailCampaign.name = name;
    emailCampaign.subject = subject;
    emailCampaign.type = "classic";
    emailCampaign.htmlContent = htmlContent;
    
    // Sender must be a verified email in your Brevo dashboard
    emailCampaign.sender = {
      name: process.env.EMAIL_SENDER_NAME || "My App",
      email: process.env.EMAIL_SENDER
    };

    // Recipients are defined by List IDs
    emailCampaign.recipients = { listIds: listIds };

    const data = await apiInstance.createEmailCampaign(emailCampaign);
    
    console.log("✅ Campaign created successfully. ID:", data.id);
    return data;
  } catch (error) {
    // The SDK wraps errors in a response object
    const errorMessage = error.response?.text || error.message;
    console.error("❌ Failed to create campaign:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default createCampaign;
