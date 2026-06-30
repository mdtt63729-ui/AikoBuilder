const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Start a build process
router.post('/start', (req, res) => {
  const { projectName, config } = req.body;

  if (!projectName) {
    return res.status(400).json({ error: 'projectName is required' });
  }

  const buildId = Date.now().toString();
  const buildDir = path.join(__dirname, '../workspace', buildId);

  try {
    fs.mkdirSync(buildDir, { recursive: true });
    
    // Save build configuration
    const configPath = path.join(buildDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify({
      projectName,
      config: config || {},
      startTime: new Date().toISOString(),
      status: 'building'
    }, null, 2));

    res.json({
      message: 'Build started',
      buildId: buildId,
      projectName: projectName
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start build', details: err.message });
  }
});

// Get build status
router.get('/status/:buildId', (req, res) => {
  const { buildId } = req.params;
  const configPath = path.join(__dirname, '../workspace', buildId, 'config.json');

  try {
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ error: 'Build not found' });
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get build status', details: err.message });
  }
});

// List all builds
router.get('/', (req, res) => {
  const workspaceDir = path.join(__dirname, '../workspace');

  if (!fs.existsSync(workspaceDir)) {
    return res.json({ builds: [] });
  }

  fs.readdir(workspaceDir, (err, builds) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read workspace directory' });
    }
    res.json({ builds: builds });
  });
});

module.exports = router;
