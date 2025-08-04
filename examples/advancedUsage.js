const EmailSender = require("../emailSender");
const path = require("path");

async function advancedExample() {
  const emailSender = new EmailSender();

  // Check connection
  const isConnected = await emailSender.verifyConnection();
  if (!isConnected) {
    console.log("❌ Email configuration error. Check your .env file.");
    return;
  }

  try {
    // Create a newsletter-style HTML email
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Weekly Newsletter</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">Stay updated with our latest news</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">This Week's Highlights</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #4a5568; margin-top: 0;">🚀 New Features Released</h3>
              <p style="color: #666; line-height: 1.6;">We've launched several exciting new features that will enhance your experience with our platform.</p>
            </div>
            
            <div style="background-color: #f0fff4; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #48bb78;">
              <h3 style="color: #2d3748; margin-top: 0;">📈 Performance Improvements</h3>
              <p style="color: #666; line-height: 1.6;">Our latest updates have improved system performance by 40% across all modules.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Read More</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #2d3748; padding: 20px; text-align: center;">
            <p style="color: #a0aec0; margin: 0; font-size: 14px;">© 2024 Your Company. All rights reserved.</p>
            <p style="color: #718096; margin: 5px 0 0 0; font-size: 12px;">You received this email because you subscribed to our newsletter.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the newsletter
    await emailSender.sendEmail({
      to: ["subscriber@example.com"],
      subject: "📬 Your Weekly Newsletter - Amazing Updates Inside!",
      html: htmlTemplate,
      text: `
        Weekly Newsletter
        
        This Week's Highlights:
        
        🚀 New Features Released
        We've launched several exciting new features that will enhance your experience with our platform.
        
        📈 Performance Improvements  
        Our latest updates have improved system performance by 40% across all modules.
        
        Read more at our website.
        
        © 2024 Your Company. All rights reserved.
      `,
    });

    // Send email with attachment (if you have a file to attach)
    /* 
    await emailSender.sendEmail({
      to: 'recipient@example.com',
      subject: 'Document Attached',
      text: 'Please find the attached document.',
      attachments: [
        {
          filename: 'report.pdf',
          path: path.join(__dirname, 'files', 'report.pdf')
        },
        {
          filename: 'data.csv',
          content: 'Name,Email\nJohn Doe,john@example.com\nJane Smith,jane@example.com',
          contentType: 'text/csv'
        }
      ]
    });
    */

    console.log("✅ Advanced email examples sent successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

advancedExample();
