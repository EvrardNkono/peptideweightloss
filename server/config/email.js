// server/config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendTrackingEmail = async (to, name, trackingToken) => {
  const trackingLink = `http://localhost:5173/track-prescription/${trackingToken}`;
  
  const mailOptions = {
    from: `"Peptide Weight Loss" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your Prescription Request Status',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563EB, #10B981); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Peptide Weight Loss</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Premium Research Peptides</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #1f2937; margin-top: 0;">Dear ${name},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for submitting your prescription consultation request. 
              Our medical team will review your information within 24-48 hours.
            </p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #bbf7d0;">
              <p style="color: #166534; margin-bottom: 15px; font-weight: bold;">Click the button below to track your prescription status:</p>
              <a href="${trackingLink}" 
                 style="display: inline-block; background: #2563EB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: background 0.3s;">
                Track My Prescription
              </a>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              You can also save this unique tracking ID for future reference:
              <br />
              <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${trackingToken}</code>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
              If you didn't request this consultation, please ignore this email.
              <br />
              This is an automated message, please do not reply directly to this email.
              <br /><br />
              Need help? Contact us at <a href="mailto:support@peptideweightloss.com" style="color: #2563EB;">support@peptideweightloss.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { sendTrackingEmail };