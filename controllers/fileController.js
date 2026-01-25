const path = require("path");
const multer = require("multer");

// Try to load multer; if it's missing, export a safe handler that returns an informative error
let uploadFile;
try {
  // configure multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const upload = multer({ storage });

  // middleware chain: use upload.single('file') in route
  uploadFile = [
    upload.single("file"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      // return file info
      const url = `/uploads/${req.file.filename}`;
      res.status(201).json({ filename: req.file.filename, url });
    },
  ];
} catch (err) {
  // multer is not installed; export a handler that returns a helpful message instead of crashing the app
  uploadFile = [
    (req, res) => {
      res
        .status(500)
        .json({
          message:
            "Server missing dependency 'multer'. Run 'npm install multer' in project root.",
        });
    },
  ];
}

module.exports = { uploadFile };
