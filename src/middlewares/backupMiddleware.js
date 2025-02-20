const multer = require('multer');
const path = require('path');

// Set up storage for backup files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `restore-${Date.now()}.sql`);
  },
});

// File filter for SQL files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/sql' ||
    file.originalname.endsWith('.sql') ||
    file.mimetype === 'application/octet-stream') {
    cb(null, true);
  } else {
    cb(new Error('Please upload a SQL backup file'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).single('file');

module.exports = upload; 