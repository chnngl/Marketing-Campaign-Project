import nodemailer from "nodemailer";

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      return transporter;
    })();
  }
  return transporterPromise;
}

interface SendCampaignEmailParams {
  recipientEmail: string;
  campaignName: string;
  emailSubject: string;
  ctaText: string;
  landingPageUrl: string;
  description: string;
}

export async function sendCampaignEmail({
  recipientEmail,
  campaignName,
  emailSubject,
  ctaText,
  landingPageUrl,
  description,
}: SendCampaignEmailParams): Promise<{
  messageId: string;
  previewUrl: string | false;
}> {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Marketing Campaigns" <no-reply@example.com>',
    to: recipientEmail,
    subject: emailSubject,
    text: `${campaignName}\n\n${description}\n\nOpen: ${landingPageUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${campaignName}</h2>
        <p>${description}</p>
        <p>
          <a href="${landingPageUrl}"
             style="
               display: inline-block;
               padding: 10px 16px;
               background: #2563eb;
               color: white;
               text-decoration: none;
               border-radius: 6px;
             ">
            ${ctaText}
          </a>
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("Message sent:", info.messageId);
  console.log("Preview URL:", previewUrl);

  return {
    messageId: info.messageId,
    previewUrl,
  };
}