const { parseCSV, saveUsersToDB } = require('../services/csvService');
const { sendEmailNotification } = require('../services/emailService');
const User = require('../models/userModel');

exports.createUsers = async (req, res) => {
  let filePath;
  try {
    console.log('Starting createUsers process:', {
      fileExists: !!req.file,
      fileInfo: req.file
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a CSV file'
      });
    }

    filePath = req.file.path;
    console.log('Attempting to parse CSV file:', { filePath });

    const users = await parseCSV(filePath);
    if (!users.length) {
      throw new Error('No valid users found in CSV file');
    }

    console.log('CSV parsing completed:', {
      usersCount: users.length,
      sampleUser: users[0]
    });

    // Save users to database
    console.log('Attempting to save users to database');
    const savedUsers = await saveUsersToDB(users);
    console.log('Users successfully saved to database:', savedUsers.length);

    // Extract all email addresses
    const emails = savedUsers.map(user => user.email);

    try {
      // Send email notifications to all users at once
      await sendEmailNotification(emails);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue with the response even if email sending fails
      return res.status(200).json({
        success: true,
        message: 'CSV data uploaded successfully, but email notifications failed.',
        error: emailError.message,
        usersCount: savedUsers.length
      });
    }

    // Clean up - delete the uploaded file
    require('fs').unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'CSV data uploaded and users notified.',
      usersCount: savedUsers.length
    });
  } catch (error) {
    console.error('Error in createUsers:', {
      errorMessage: error.message,
      errorStack: error.stack,
      stage: filePath ? 'post-file-upload' : 'pre-file-upload'
    });

    // Clean up on error
    if (filePath && require('fs').existsSync(filePath)) {
      require('fs').unlinkSync(filePath);
    }

    // Handle different types of errors
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid data in CSV file',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading CSV data'
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch users'
    });
  }
}; 