const BackupService = require('../services/backupService');
const fs = require('fs');
const upload = require('../middlewares/backupMiddleware');

exports.downloadBackup = async (req, res) => {
  try {
    const backup = await BackupService.createBackup();

    // Send file as download
    res.download(
      backup.path,
      backup.filename,
      (err) => {
        if (err) {
          console.error('Download failed:', err);
        }
        // Clean up - delete file after sending
        fs.unlink(backup.path, (unlinkErr) => {
          if (unlinkErr) console.error('Cleanup failed:', unlinkErr);
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create SQL backup'
    });
  }
};

exports.restoreBackup = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload a SQL backup file'
        });
      }

      console.log('Uploaded file:', req.file);
      await BackupService.restoreFromBackup(req.file.path);

      // Clean up - delete uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Cleanup failed:', err);
      });

      res.status(200).json({
        success: true,
        message: 'Database restored successfully from SQL backup'
      });
    } catch (error) {
      console.error('Restore error:', error);
      // Clean up on error
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Cleanup failed:', err);
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to restore from SQL backup'
      });
    }
  });
}; 