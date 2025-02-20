const nodemailer = require('nodemailer');
const config = require('../config/emailConfig');

let transporter = null;

// Initialize transporter with retry
const initializeTransporter = async (retries = 3) => {
  try {
    if (!transporter) {
      transporter = nodemailer.createTransport(config);

      // Verify connection
      await transporter.verify();
      console.log('Email server is ready to send messages');
    }
    return transporter;
  } catch (error) {
    console.error('Email configuration error:', error);
    if (retries > 0) {
      console.log(`Retrying email configuration... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return initializeTransporter(retries - 1);
    }
    throw new Error('Failed to initialize email transport');
  }
};

const sendEmailNotification = async (emails) => {
  try {
    // Ensure transporter is initialized
    const emailTransporter = await initializeTransporter();

    console.log('Attempting to send emails to:', emails);

    // Split emails into chunks of 50 to avoid Gmail limits
    const chunkSize = 50;
    const emailChunks = [];
    for (let i = 0; i < emails.length; i += chunkSize) {
      emailChunks.push(emails.slice(i, i + chunkSize));
    }

    // Send emails in chunks
    for (const chunk of emailChunks) {
      const info = await emailTransporter.sendMail({
        from: `"User Management System" <${config.auth.user}>`,
        bcc: chunk.join(', '), // Use BCC for privacy
        subject: 'Welcome to Our Platform ✔',
        text: 'Your data has been successfully uploaded to our platform.'
      });

      console.log('Emails sent successfully. Message ID:', info.messageId);
    }

    return { success: true, message: 'All emails sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);

    // Reset transporter on connection errors
    if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      transporter = null;
    }

    throw new Error(`Failed to send emails: ${error.message}`);
  }
};

// Initialize transporter on module load
initializeTransporter().catch(console.error);

module.exports = { sendEmailNotification }; 