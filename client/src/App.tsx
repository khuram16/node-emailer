import React, { useState, useEffect } from "react";
import "./App.css";

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

function App() {
  const [emailData, setEmailData] = useState<EmailData>({
    to: "black.arrow.app@gmail.com",
    subject: "Email from React Client",
    text: "Hello! This email was sent from the React client with test.pdf automatically attached.",
  });

  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [testPdfAttached, setTestPdfAttached] = useState(true);

  const API_BASE_URL = "http://localhost:3030";

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-connection`);
      const result: ApiResponse = await response.json();

      if (result.success) {
        setConnectionStatus("✅ SMTP Connected");
      } else {
        setConnectionStatus("❌ SMTP Failed");
      }
    } catch (error) {
      setConnectionStatus("❌ Connection Error");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const sendEmailWithTestPdf = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-test-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: emailData.to }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        showAlert("success", `✅ ${result.message} (ID: ${result.messageId})`);
      } else {
        showAlert("error", `❌ ${result.message}`);
      }
    } catch (error) {
      showAlert(
        "error",
        `❌ Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    setLoading(false);
  };

  const sendCustomEmail = async () => {
    setLoading(true);
    setAlert(null);

    try {
      if (testPdfAttached) {
        // Send with test.pdf attached using the test PDF endpoint
        const response = await fetch(`${API_BASE_URL}/api/send-test-pdf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
          }),
        });

        const result: ApiResponse = await response.json();

        if (result.success) {
          showAlert(
            "success",
            `✅ Email with test.pdf sent successfully! (ID: ${result.messageId})`
          );
        } else {
          showAlert("error", `❌ ${result.message}`);
        }
      } else {
        // Send without attachment
        const response = await fetch(`${API_BASE_URL}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });

        const result: ApiResponse = await response.json();

        if (result.success) {
          showAlert(
            "success",
            `✅ ${result.message} (ID: ${result.messageId})`
          );
        } else {
          showAlert("error", `❌ ${result.message}`);
        }
      }
    } catch (error) {
      showAlert(
        "error",
        `❌ Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    setLoading(false);
  };

  const fillSampleData = () => {
    setEmailData({
      to: "black.arrow.app@gmail.com",
      subject: "🚀 React Email Client Test",
      text: "Hello! This is a test email sent from the React client application. The test.pdf file has been automatically attached to demonstrate the attachment functionality.",
    });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📧 React Email Client</h1>
        <p>Send emails with automatic test.pdf attachment</p>
        <div className="connection-status">
          <span>{connectionStatus}</span>
          <button onClick={checkConnection} className="btn-secondary">
            🔄 Test Connection
          </button>
        </div>
      </header>

      <main className="app-main">
        {alert && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}

        <div className="quick-actions">
          <h3>🚀 Quick Actions</h3>
          <button
            onClick={sendEmailWithTestPdf}
            className="btn-success"
            disabled={loading}
          >
            📎 Send Test Email + PDF
          </button>
          <button
            onClick={fillSampleData}
            className="btn-secondary"
            disabled={loading}
          >
            📝 Fill Sample Data
          </button>
        </div>

        <div className="email-form">
          <h3>📝 Custom Email</h3>

          <div className="form-group">
            <label htmlFor="to">To:</label>
            <input
              type="email"
              id="to"
              name="to"
              value={emailData.to}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="text">Message:</label>
            <textarea
              id="text"
              name="text"
              value={emailData.text}
              onChange={handleInputChange}
              className="form-control"
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={testPdfAttached}
                onChange={(e) => setTestPdfAttached(e.target.checked)}
              />
              📎 Automatically attach test.pdf
            </label>
          </div>

          <button
            onClick={sendCustomEmail}
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "⏳ Sending..."
              : testPdfAttached
              ? "📧 Send Email + PDF"
              : "📧 Send Email"}
          </button>
        </div>

        <div className="info-panel">
          <h3>ℹ️ Information</h3>
          <ul>
            <li>
              🖥️ <strong>Server:</strong> http://localhost:3000
            </li>
            <li>
              ⚛️ <strong>React Client:</strong> http://localhost:3001
            </li>
            <li>
              📎 <strong>Auto-attach:</strong>{" "}
              {testPdfAttached ? "test.pdf will be attached" : "No attachment"}
            </li>
            <li>
              ✉️ <strong>Email Provider:</strong> Gmail SMTP
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
