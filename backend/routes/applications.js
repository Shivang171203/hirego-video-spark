const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all applications for a job
router.get('/job/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new application
router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('applications').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update an application
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('applications').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Delete an application
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
