const csvParser = require('csv-parser');
const fs = require('fs');
const User = require('../models/userModel');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const users = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Clean and validate data
        const user = {
          name: row.name?.trim(),
          email: row.email?.trim().toLowerCase(),
          username: row.username?.trim(),
          address: row.address?.trim(),
          role: (row.role?.trim().toUpperCase() === 'ADMIN') ? 'ADMIN' : 'USER'
        };
        
        // Basic validation
        if (user.name && user.email && user.username && user.address) {
          users.push(user);
        } else {
          console.warn('Skipping invalid row:', row);
        }
      })
      .on('end', () => resolve(users))
      .on('error', (err) => reject(err));
  });
};

const saveUsersToDB = async (users) => {
  try {
    console.log('Attempting to save users:', users[0]); // Log first user for debugging

    const result = await User.bulkCreate(users, {
      validate: true,
      updateOnDuplicate: ['name', 'username', 'address', 'role', 'updatedAt'],
      fields: ['name', 'email', 'username', 'address', 'role'],
      returning: true // Return the created records
    });

    console.log(`Successfully saved ${result.length} users`);
    console.log('First saved user:', result[0].toJSON()); // Log the first saved user
    
    // Verify data in database
    const count = await User.count();
    console.log(`Total users in database: ${count}`);

    return result;
  } catch (error) {
    console.error('Error saving users:', error);
    if (error.name === 'SequelizeBulkRecordError') {
      const validationErrors = error.errors.map(err => ({
        message: err.message,
        value: err.value,
        field: err.path
      }));
      throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
    }
    throw error;
  }
};

module.exports = { parseCSV, saveUsersToDB };
