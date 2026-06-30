const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Download build output
router.get('/:buildId/:filename', (req, res) => {
  const { buildId, filename } = req.params;
  const filePath = path.join(__dirname, '../output', buildId, filename);

  try {
    // Prevent directory traversal attacks
    const resolvedPath = path.resolve(filePath);
    const baseDir = path.resolve(path.join(__dirname, '../output'));
    
    if (!resolvedPath.startsWith(baseDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, filename, (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Download failed', details: err.message });
  }
});

// List available outputs for a build
router.get('/:buildId', (req, res) => {
  const { buildId } = req.params;
  const outputDir = path.join(__dirname, '../output', buildId);

  try {
    if (!fs.existsSync(outputDir)) {
      return res.json({ files: [], buildId: buildId });
    }

    fs.readdir(outputDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read output directory' });
      }
      res.json({ files: files, buildId: buildId });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list files', details: err.message });
  }
});

module.exports = router;
