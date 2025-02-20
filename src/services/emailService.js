const nodemailer = require('nodemailer');
const config = require('../config/emailConfig');

class EmailService {
  static async createTransporter() {
    try {
      const transporter = nodemailer.createTransport(config);

      // Verify connection configuration
      await transporter.verify();
      console.log('Email service is ready');
      return transporter;
    } catch (error) {
      console.error('Email service configuration error:', error);
      throw error;
    }
  }

  static async sendEmailNotification(emails) {
    if (!emails || emails.length === 0) {
      console.log('No emails to send');
      return;
    }

    try {
      const transporter = await this.createTransporter();

      // Split emails into chunks of 50 to avoid Gmail limits
      const chunkSize = 50;
      const emailChunks = [];
      for (let i = 0; i < emails.length; i += chunkSize) {
        emailChunks.push(emails.slice(i, i + chunkSize));
      }

      for (const chunk of emailChunks) {
        const mailOptions = {
          from: `"User Management System" <${config.auth.user}>`,
          bcc: chunk.join(', '), // Use BCC for privacy
          subject: 'Welcome to Our Platform ✔',
          text: 'Your data has been successfully uploaded to our platform.',
          html: '<b>Your data has been successfully uploaded to our platform.</b>'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
      }

      return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
      console.error('Failed to send emails:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = { sendEmailNotification: EmailService.sendEmailNotification.bind(EmailService) }; 