# Node.js Email Sender with Nodemailer

A simple and powerful Node.js email sender built with Nodemailer that supports HTML emails, attachments, and multiple recipients.

## Features

- ✅ Send text and HTML emails
- ✅ Support for multiple recipients (TO, CC, BCC)
- ✅ File attachments
- ✅ SMTP connection verification
- ✅ Environment-based configuration
- ✅ Error handling and logging
- ✅ Multiple email provider support (Gmail, Outlook, Yahoo, custom SMTP)

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Set up your email configuration:

```bash
# Copy the example environment file
cp .env.example .env
```

4. Edit the `.env` file with your email credentials:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Email Provider Setup

### Gmail Setup

1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings → Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use this app password (not your regular password) in the `EMAIL_PASS` field

### Other Providers

- **Outlook/Hotmail**: `smtp.live.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **Custom SMTP**: Use your provider's SMTP settings

## Usage

### Basic Usage

```javascript
const EmailSender = require("./emailSender");

async function sendEmail() {
  const emailSender = new EmailSender();

  // Verify connection
  await emailSender.verifyConnection();

  // Send simple text email
  await emailSender.sendSimpleEmail(
    "recipient@example.com",
    "Hello!",
    "This is a test email."
  );
}
```

### Advanced Usage

```javascript
const emailSender = new EmailSender();

// Send HTML email with multiple recipients
await emailSender.sendEmail({
  to: ["user1@example.com", "user2@example.com"],
  cc: "manager@example.com",
  subject: "Important Update",
  html: "<h1>Hello!</h1><p>This is an <strong>HTML</strong> email.</p>",
  text: "Hello! This is a plain text email.",
  attachments: [
    {
      filename: "document.pdf",
      path: "./files/document.pdf",
    },
  ],
});
```

## API Reference

### EmailSender Class

#### Methods

- `verifyConnection()` - Test SMTP connection
- `sendEmail(options)` - Send email with full options
- `sendSimpleEmail(to, subject, text)` - Send basic text email
- `sendHtmlEmail(to, subject, html, text)` - Send HTML email
- `sendEmailWithAttachment(to, subject, text, attachmentPath, attachmentName)` - Send email with file attachment

#### Email Options

```javascript
{
  to: 'recipient@example.com' | ['email1@example.com', 'email2@example.com'],
  cc: 'cc@example.com' | ['cc1@example.com', 'cc2@example.com'],
  bcc: 'bcc@example.com' | ['bcc1@example.com', 'bcc2@example.com'],
  subject: 'Email Subject',
  text: 'Plain text content',
  html: '<h1>HTML content</h1>',
  attachments: [
    {
      filename: 'file.pdf',
      path: './path/to/file.pdf'
    },
    {
      filename: 'data.csv',
      content: 'csv,data,here',
      contentType: 'text/csv'
    }
  ]
}
```

## Examples

Run the examples:

```bash
# Basic usage example
node examples/basicUsage.js

# Advanced usage with HTML templates
node examples/advancedUsage.js

# Main example file
node index.js
```

## Scripts

- `npm start` - Run the main application
- `npm run dev` - Run with file watching (Node.js 18+)

## Error Handling

The email sender includes comprehensive error handling:

- SMTP connection verification
- Input validation
- Detailed error messages
- Success/failure logging

## Security Notes

- Never commit your `.env` file to version control
- Use app-specific passwords for Gmail
- Keep your email credentials secure
- Consider rate limiting for production use

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
