const EmailSender = require("./emailSender");

async function main() {
  // Initialize email sender
  const emailSender = new EmailSender();

  // Verify SMTP connection
  const isConnected = await emailSender.verifyConnection();
  if (!isConnected) {
    console.log("Please check your email configuration in .env file");
    process.exit(1);
  }

  try {
    // Example 1: Send a simple text email
    console.log("\n📧 Sending simple text email...");
    await emailSender.sendSimpleEmail(
      "black.arrow.app@gmail.com",
      "Test Email from Node.js",
      "Hello! This is a test email sent from Node.js using Nodemailer."
    );

    // Example 2: Send an HTML email
    console.log("\n📧 Sending HTML email...");
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Service!</h2>
        <p>This is an <strong>HTML email</strong> sent from Node.js.</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Features:</h3>
          <ul>
            <li>Easy to use</li>
            <li>Supports HTML and text</li>
            <li>Attachment support</li>
          </ul>
        </div>
        <p>Best regards,<br>Your Node.js App</p>
      </div>
    `;

    await emailSender.sendHtmlEmail(
      "black.arrow.app@gmail.com",
      "HTML Email Test",
      htmlContent,
      "This is the plain text version of the email."
    );

    // Example 3: Send email with multiple recipients
    console.log("\n📧 Sending email to multiple recipients...");
    await emailSender.sendEmail({
      to: ["black.arrow.app@gmail.com", "black.arrow.app@gmail.com"],
      cc: "manager@example.com",
      subject: "Team Notification",
      text: "This email was sent to multiple recipients with CC.",
      html: "<p>This email was sent to <strong>multiple recipients</strong> with CC.</p>",
    });

    // Example 4: Send email with PDF attachment
    console.log("\n📧 Sending email with PDF attachment...");
    await emailSender.testAttachmentEmail(
      "black.arrow.app@gmail.com",
      "./test.pdf"
    );

    console.log("\n✅ All emails sent successfully!");
  } catch (error) {
    console.error("\n❌ Error sending emails:", error.message);
  }
}

// Uncomment the line below to run the examples
main();

// Export for use in other modules
module.exports = { EmailSender };
