const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/candidate-dashboard/jobs
router.get('/jobs', async (req, res) => {
  // Demo: fetch all jobs from 'jobs' table in Supabase
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('id', { ascending: true });
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

// GET /api/candidate-dashboard/stats
router.get('/stats', async (req, res) => {
  // Demo: fetch stats for the current candidate (replace with real user logic)
  // For now, return static values
  res.json({
    success: true,
    data: {
      videosCompleted: 1,
      averageAiScore: 95,
      applicationsSent: 3,
    },
  });
});

// GET /api/candidate-dashboard/activity
router.get('/activity', async (req, res) => {
  // Demo: fetch recent activity for the candidate (replace with real user logic)
  // For now, return static values
  res.json({
    success: true,
    data: [
      { message: 'Product Manager video completed', time: '2 hours ago' },
      { message: 'Frontend Developer application viewed', time: '1 day ago' },
    ],
  });
});

module.exports = router;
