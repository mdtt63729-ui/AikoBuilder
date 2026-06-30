const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Get logs for a specific build
router.get('/:buildId', (req, res) => {
  const { buildId } = req.params;
  const logsPath = path.join(__dirname, '../workspace', buildId, 'logs.txt');

  try {
    if (!fs.existsSync(logsPath)) {
      return res.json({ logs: '', message: 'No logs available yet' });
    }

    const logs = fs.readFileSync(logsPath, 'utf-8');
    res.json({ logs: logs, buildId: buildId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read logs', details: err.message });
  }
});

// Append logs for a build
router.post('/:buildId', (req, res) => {
  const { buildId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const buildDir = path.join(__dirname, '../workspace', buildId);
  const logsPath = path.join(buildDir, 'logs.txt');

  try {
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(logsPath, logEntry);
    
    res.json({ message: 'Log entry added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write logs', details: err.message });
  }
});

// Clear logs for a build
router.delete('/:buildId', (req, res) => {
  const { buildId } = req.params;
  const logsPath = path.join(__dirname, '../workspace', buildId, 'logs.txt');

  try {
    if (fs.existsSync(logsPath)) {
      fs.unlinkSync(logsPath);
    }
    res.json({ message: 'Logs cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear logs', details: err.message });
  }
});

module.exports = router;
