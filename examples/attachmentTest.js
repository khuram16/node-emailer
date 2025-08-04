const EmailSender = require("../emailSender");
const path = require("path");

async function attachmentExample() {
  const emailSender = new EmailSender();

  // Check connection
  const isConnected = await emailSender.verifyConnection();
  if (!isConnected) {
    console.log("❌ Email configuration error. Check your .env file.");
    return;
  }

  try {
    console.log("📎 Testing email attachment functionality...\n");

    // Test 1: Send email with PDF attachment using the dedicated method
    console.log("🔹 Test 1: Using testAttachmentEmail method");
    await emailSender.testAttachmentEmail(
      "black.arrow.app@gmail.com",
      "./test.pdf"
    );

    // Test 2: Send email with attachment using the general sendEmail method
    console.log("🔹 Test 2: Using general sendEmail method");
    await emailSender.sendEmail({
      to: "black.arrow.app@gmail.com",
      subject: "📎 Manual Attachment Test",
      text: "This email has a PDF attachment sent using the general sendEmail method.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>📎 Manual Attachment Test</h2>
          <p>This email demonstrates sending attachments using the general <code>sendEmail</code> method.</p>
          <p><strong>Attached file:</strong> test.pdf</p>
        </div>
      `,
      attachments: [
        {
          filename: "test.pdf",
          path: path.join(__dirname, "..", "test.pdf"),
        },
      ],
    });

    // Test 3: Send email with multiple attachments
    console.log("🔹 Test 3: Multiple attachments");
    await emailSender.sendEmail({
      to: "black.arrow.app@gmail.com",
      subject: "📎 Multiple Attachments Test",
      text: "This email contains multiple attachments.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>📎 Multiple Attachments Test</h2>
          <p>This email demonstrates sending multiple files as attachments:</p>
          <ul>
            <li>test.pdf (existing PDF file)</li>
            <li>test-document.txt (text file)</li>
            <li>package.json (project configuration)</li>
          </ul>
        </div>
      `,
      attachments: [
        {
          filename: "test.pdf",
          path: "./test.pdf",
        },
        {
          filename: "test-document.txt",
          path: "./test-document.txt",
        },
        {
          filename: "package.json",
          path: "./package.json",
        },
      ],
    });

    console.log("\n✅ All attachment tests completed successfully!");
    console.log(
      "📧 Check your email inbox for the test messages with attachments."
    );
  } catch (error) {
    console.error("❌ Error during attachment testing:", error.message);
  }
}

attachmentExample();
