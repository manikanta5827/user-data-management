const multer = require('multer');
const path = require('path');

// Set up file storage with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        const dir = 'uploads/';
        require('fs').mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// File filter for CSV files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(new Error('Please upload a CSV file'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Export the middleware
module.exports = upload.single('file'); 