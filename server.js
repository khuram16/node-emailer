const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const EmailSender = require("./emailSender");

const app = express();
const PORT = 3000;

// Initialize email sender
const emailSender = new EmailSender();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${timestamp}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test SMTP connection
app.get("/api/test-connection", async (req, res) => {
  try {
    const isConnected = await emailSender.verifyConnection();
    res.json({
      success: isConnected,
      message: isConnected
        ? "SMTP connection verified"
        : "SMTP connection failed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error testing connection",
      error: error.message,
    });
  }
});

// Send simple email
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: to, subject, and either text or html",
      });
    }

    const result = await emailSender.sendEmail({
      to,
      subject,
      text,
      html,
    });

    res.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Send email with attachments
app.post(
  "/api/send-email-with-attachments",
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const { to, subject, text, html } = req.body;
      const files = req.files;

      if (!to || !subject || (!text && !html)) {
        // Clean up uploaded files if validation fails
        if (files) {
          files.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting file:", err);
            });
          });
        }
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: to, subject, and either text or html",
        });
      }

      // Prepare attachments
      const attachments = files
        ? files.map((file) => ({
            filename: file.originalname,
            path: file.path,
          }))
        : [];

      const result = await emailSender.sendEmail({
        to,
        subject,
        text,
        html,
        attachments,
      });

      // Clean up uploaded files after sending
      if (files) {
        files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }

      res.json({
        success: true,
        message: "Email with attachments sent successfully",
        messageId: result.messageId,
        attachmentCount: attachments.length,
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to send email with attachments",
        error: error.message,
      });
    }
  }
);

// Send email with predefined test.pdf
app.post("/api/send-test-pdf", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required",
      });
    }

    const result = await emailSender.testAttachmentEmail(to, "./test.pdf");

    res.json({
      success: true,
      message: "Test PDF email sent successfully",
      messageId: result.messageId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send test PDF",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB.",
      });
    }
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email Sender Web UI running at http://localhost:${PORT}`);
  console.log(`📧 Ready to send emails through the web interface!`);

  // Test SMTP connection on startup
  emailSender.verifyConnection().then((isConnected) => {
    if (isConnected) {
      console.log("✅ SMTP connection verified - Ready to send emails!");
    } else {
      console.log(
        "❌ SMTP connection failed - Please check your .env configuration"
      );
    }
  });
});
