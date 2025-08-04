const EmailSender = require("../emailSender");

async function basicExample() {
  const emailSender = new EmailSender();

  // Check connection
  const isConnected = await emailSender.verifyConnection();
  if (!isConnected) {
    console.log("❌ Email configuration error. Check your .env file.");
    return;
  }

  try {
    // Send a simple email
    const result = await emailSender.sendSimpleEmail(
      "test@example.com",
      "Hello from Node.js!",
      "This is a test email sent using Nodemailer."
    );

    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

basicExample();
