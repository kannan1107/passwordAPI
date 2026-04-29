export const createEmailCampaign = async (data) => {
  const res = await fetch("https://api.brevo.com/v3/emailCampaigns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      name: data.name,
      subject: data.subject,
      sender: data.sender,
      type: "classic",
      htmlContent: data.htmlContent,
      recipients: data.recipients,
      ...(data.scheduledAt && { scheduledAt: data.scheduledAt }),
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(result));

  console.log("✅ Campaign created:", result.id);
  return result;
};
