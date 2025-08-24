const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all jobs
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('jobs').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new job
router.post('/', async (req, res) => {
  try {
    // Build payload from request and then enforce safe defaults
    const payload = {
      ...req.body,
    };

    // Ensure required DB columns have safe defaults
    payload.questions = payload.questions ?? 0;
    // duration expected as string (e.g. "8-10 minutes"); default to 'N/A' instead of null
    payload.duration = payload.duration ?? 'N/A';
    payload.skills = payload.skills ?? [];
    payload.status = payload.status ?? 'available';

    const { data, error } = await supabase.from('jobs').insert([payload]).select();
    if (error) {
      console.error('Supabase insert error (jobs):', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error creating job:', err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const payload = {
      ...req.body,
    };
    // prevent accidental nulls for required fields
    if (payload.questions === null) payload.questions = 0;
    if (payload.duration === null) payload.duration = 'N/A';

    const { data, error } = await supabase.from('jobs').update(payload).eq('id', id).select();
    if (error) {
      console.error('Supabase update error (jobs):', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error updating job:', err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
