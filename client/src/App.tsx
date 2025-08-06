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
    text: "Hello! This email was sent from the React client with file automatically attached.",
  });

  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [autoAttachFiles, setAutoAttachFiles] = useState(true);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
      if (autoAttachFiles && selectedFiles.length > 0) {
        // Send with user-selected files attached
        const formData = new FormData();
        formData.append("to", emailData.to);
        formData.append("subject", emailData.subject);
        formData.append("text", emailData.text);

        // Add all selected files
        selectedFiles.forEach((file) => {
          formData.append("attachments", file);
        });

        const response = await fetch(
          `${API_BASE_URL}/api/send-email-with-attachments`,
          {
            method: "POST",
            body: formData, // No Content-Type header for FormData
          }
        );

        const result: ApiResponse = await response.json();

        if (result.success) {
          showAlert(
            "success",
            `✅ Email with ${selectedFiles.length} attachment(s) sent successfully! (ID: ${result.messageId})`
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
      text: "Hello! This is a test email sent from the React client application. Files have been automatically attached from user selection.",
    });
  };

  const loadTestPdf = () => {
    // Create a file input to select the test.pdf or any other file
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png,.zip";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setSelectedFiles((prev) => [...prev, ...files]);
    };
    input.click();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📧 React Email Client</h1>
        <p>Send emails with automatic file attachment from user selection</p>
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
            📎 Send Test Email + Server PDF
          </button>
          <button
            onClick={loadTestPdf}
            className="btn-secondary"
            disabled={loading}
          >
            📁 Select Files to Attach
          </button>
          <button
            onClick={fillSampleData}
            className="btn-secondary"
            disabled={loading}
          >
            📝 Fill Sample Data
          </button>
        </div>

        {/* File Selection Area */}
        <div className="file-selection">
          <h3>📎 File Attachments</h3>

          <div className="file-upload-area">
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileSelect}
              className="file-input"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip,.xlsx,.csv"
            />
            <label htmlFor="fileInput" className="file-upload-label">
              <div className="upload-icon">📁</div>
              <div>
                <strong>Click to select files</strong>
                <p>PDF, DOC, images, and more (Max 10MB each)</p>
              </div>
            </label>
          </div>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h4>Selected Files:</h4>
              <div className="file-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-info">
                      📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="remove-file-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                checked={autoAttachFiles}
                onChange={(e) => setAutoAttachFiles(e.target.checked)}
              />
              📎 Automatically attach selected files ({selectedFiles.length}{" "}
              files)
            </label>
          </div>

          <button
            onClick={sendCustomEmail}
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "⏳ Sending..."
              : autoAttachFiles && selectedFiles.length > 0
              ? `📧 Send Email + ${selectedFiles.length} File(s)`
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
              📎 <strong>Selected Files:</strong> {selectedFiles.length} files
            </li>
            <li>
              📁 <strong>Upload Method:</strong> Client-side file selection
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
