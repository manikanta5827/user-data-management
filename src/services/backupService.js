const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const util = require('util');
const execPromise = util.promisify(exec);

dotenv.config();

// Validate database environment variables
const validateDBConfig = () => {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing required database configuration: ${missing.join(', ')}`);
  }
};

exports.createBackup = async () => {
  try {
    validateDBConfig();

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const backupPath = path.join(__dirname, '../../backups', filename);

    // Ensure backups directory exists
    const dir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Use pg_dump with full path and additional options
    const dumpCommand = `PGPASSWORD='${process.env.DB_PASSWORD}' pg_dump \
      --host=${process.env.DB_HOST} \
      --port=${process.env.DB_PORT} \
      --username=${process.env.DB_USER} \
      --dbname=${process.env.DB_NAME} \
      --no-owner \
      --no-privileges \
      --format=plain \
      --file="${backupPath}"`;

    // Execute backup command
    const { stdout, stderr } = await execPromise(dumpCommand);
    if (stderr && !stderr.includes('NOTICE')) {
      throw new Error(`pg_dump error: ${stderr}`);
    }

    return { filename, path: backupPath };
  } catch (error) {
    console.error('Backup failed:', error);
    throw new Error(`Failed to create backup: ${error.message}`);
  }
};

exports.restoreFromBackup = async (filePath) => {
  try {
    validateDBConfig();

    // Verify file exists and is SQL
    if (!fs.existsSync(filePath)) {
      throw new Error('Backup file not found');
    }
    if (!filePath.endsWith('.sql')) {
      throw new Error('Invalid backup file format');
    }

    // Drop all tables first
    const dropCommand = `PGPASSWORD='${process.env.DB_PASSWORD}' psql \
      --host=${process.env.DB_HOST} \
      --port=${process.env.DB_PORT} \
      --username=${process.env.DB_USER} \
      --dbname=${process.env.DB_NAME} \
      -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`;

    await execPromise(dropCommand);

    // Restore from backup
    const restoreCommand = `PGPASSWORD='${process.env.DB_PASSWORD}' psql \
      --host=${process.env.DB_HOST} \
      --port=${process.env.DB_PORT} \
      --username=${process.env.DB_USER} \
      --dbname=${process.env.DB_NAME} \
      --file="${filePath}"`;

    const { stdout, stderr } = await execPromise(restoreCommand);
    if (stderr && !stderr.includes('NOTICE')) {
      throw new Error(`psql error: ${stderr}`);
    }

    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    throw new Error(`Failed to restore backup: ${error.message}`);
  }
}; 