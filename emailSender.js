const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailSender {
  constructor() {
    this.transporter = null;
    this.init();
  }

  init() {
    // Create transporter with SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP connection verified successfully");
      return true;
    } catch (error) {
      console.error("❌ SMTP connection failed:", error.message);
      return false;
    }
  }

  async sendEmail(options) {
    const { to, subject, text, html, attachments = [], cc, bcc } = options;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      throw new Error(
        "Missing required fields: to, subject, and either text or html"
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text,
      html,
      attachments,
    };

    // Add optional fields
    if (cc) mailOptions.cc = Array.isArray(cc) ? cc.join(", ") : cc;
    if (bcc) mailOptions.bcc = Array.isArray(bcc) ? bcc.join(", ") : bcc;

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully:", info.messageId);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      console.error("❌ Failed to send email:", error.message);
      throw error;
    }
  }

  async sendSimpleEmail(to, subject, message) {
    return this.sendEmail({
      to,
      subject,
      text: message,
    });
  }

  async sendHtmlEmail(to, subject, htmlContent, textContent = "") {
    return this.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent,
    });
  }

  async sendEmailWithAttachment(
    to,
    subject,
    message,
    attachmentPath,
    attachmentName
  ) {
    return this.sendEmail({
      to,
      subject,
      text: message,
      attachments: [
        {
          filename: attachmentName || "attachment",
          path: attachmentPath,
        },
      ],
    });
  }

  async testAttachmentEmail(to, attachmentPath) {
    const fileName =
      attachmentPath.split("/").pop() || attachmentPath.split("\\").pop();
    return this.sendEmail({
      to,
      subject: `📎 Test Email with Attachment - ${fileName}`,
      text: `Hello!\n\nThis is a test email with an attached file: ${fileName}\n\nThe attachment feature is working correctly!\n\nBest regards,\nNode.js Email Sender`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">📎 Test Email with Attachment</h2>
          <p>Hello!</p>
          <p>This is a test email with an attached file: <strong>${fileName}</strong></p>
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007acc;">
            <h3 style="margin-top: 0; color: #007acc;">✅ Attachment Test Results:</h3>
            <ul>
              <li>File attachment: Working ✅</li>
              <li>File name preservation: Working ✅</li>
              <li>Email delivery: Working ✅</li>
            </ul>
          </div>
          <p>The attachment feature is working correctly!</p>
          <p>Best regards,<br><strong>Node.js Email Sender</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          path: attachmentPath,
        },
      ],
    });
  }
}

module.exports = EmailSender;
