const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Only initialize if email configuration is present
    if (config.email.user && config.email.password && config.email.host) {
      try {
        this.transporter = nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.secure,
          auth: {
            user: config.email.user,
            pass: config.email.password
          }
        });
        this.isConfigured = true;
        console.log('Email service configured successfully');
      } catch (error) {
        console.warn('Email service initialization failed:', error.message);
        this.isConfigured = false;
      }
    } else {
      console.warn('Email service not configured - emails will be skipped');
      this.isConfigured = false;
    }
  }

  async sendPaymentReceipt(memberEmail, memberName, paymentDetails) {
    if (!this.isConfigured) {
      console.log('Email service not configured - skipping payment receipt');
      return;
    }

    const mailOptions = {
      from: config.email.from,
      to: memberEmail,
      subject: `Payment Receipt - FitneX Gym`,
      html: this.getPaymentReceiptTemplate(memberName, paymentDetails)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment receipt sent to ${memberEmail}`);
    } catch (error) {
      console.error('Error sending payment receipt:', error);
      // Don't throw - allow payment to succeed even if email fails
    }
  }

  async sendAccountSetupEmail(memberEmail, memberName, setupToken) {
    if (!this.isConfigured) {
      console.log('Email service not configured - skipping account setup email');
      return;
    }

    const setupUrl = `${config.app.frontendUrl}/set-password?token=${setupToken}`;
    
    const mailOptions = {
      from: config.email.from,
      to: memberEmail,
      subject: `Set Your Password - FitneX Gym Account`,
      html: this.getAccountSetupTemplate(memberName, setupUrl)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Account setup email sent to ${memberEmail}`);
    } catch (error) {
      console.error('Error sending account setup email:', error);
      // Don't throw - allow registration to succeed even if email fails
    }
  }

  getPaymentReceiptTemplate(memberName, paymentDetails) {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .receipt-details { background: white; padding: 15px; border-radius: 5px; margin-top: 15px; }
          .total { font-size: 18px; font-weight: bold; color: #4F46E5; margin-top: 15px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FitneX Gym</h1>
            <p>Payment Receipt</p>
          </div>
          
          <div class="content">
            <p>Dear ${memberName},</p>
            <p>Thank you for your payment. Here is your receipt:</p>
            
            <div class="receipt-details">
              <p><strong>Receipt ID:</strong> ${paymentDetails.paymentId}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Payment Method:</strong> ${paymentDetails.paymentMethod}</p>
              <div class="total">
                <p><strong>Total Paid:</strong> $${paymentDetails.amount.toFixed(2)}</p>
              </div>
            </div>
            
            <p style="margin-top: 20px;">Your membership has been successfully renewed.</p>
            <p>If you have any questions, please contact us.</p>
          </div>
          
          <div class="footer">
            <p>FitneX Gym - Your Fitness Partner</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAccountSetupTemplate(memberName, setupUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FitneX Gym</h1>
            <p>Welcome to the Family!</p>
          </div>
          
          <div class="content">
            <p>Dear ${memberName},</p>
            <p>Your account has been created at FitneX Gym. Please set your password to access your account.</p>
            
            <a href="${setupUrl}" class="button">Set Your Password</a>
            
            <p>This link will expire in 24 hours for security purposes.</p>
            <p>If you did not create this account, please ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>FitneX Gym - Your Fitness Partner</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
