const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { validateCandidate, validateCandidateUpdate } = require('../middleware/validation');
const { authenticateUser } = require('../middleware/auth');

// Get all candidates with pagination and filtering
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      position, 
      location, 
      minExperience,
      maxExperience,
      minAiMatch,
      hasVideoResume,
      skills
    } = req.query;

    let query = supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (position) {
      query = query.ilike('position', `%${position}%`);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (minExperience) {
      query = query.gte('experience_years', parseInt(minExperience));
    }
    if (maxExperience) {
      query = query.lte('experience_years', parseInt(maxExperience));
    }
    if (minAiMatch) {
      query = query.gte('ai_match_score', parseInt(minAiMatch));
    }
    if (hasVideoResume !== undefined) {
      query = query.eq('has_video_resume', hasVideoResume === 'true');
    }
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query = query.overlaps('skills', skillsArray);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: candidates, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true });

    res.json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get candidate by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: candidate, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Candidate not found'
        });
      }
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
});

// Create new candidate
router.post('/', validateCandidate, async (req, res, next) => {
  try {
    const candidateData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert([candidateData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
});

// Update candidate
router.put('/:id', validateCandidateUpdate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data: candidate, error } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Candidate not found'
        });
      }
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
});

// Delete candidate
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get candidate statistics
router.get('/stats/overview', async (req, res, next) => {
  try {
    const { data: stats, error } = await supabase
      .rpc('get_candidate_stats');

    if (error) {
      // Fallback to manual calculation if RPC function doesn't exist
      const { data: candidates } = await supabase
        .from('candidates')
        .select('status, ai_match_score, has_video_resume');

      if (candidates) {
        const stats = {
          total: candidates.length,
          active: candidates.filter(c => c.status === 'Active').length,
          interviewing: candidates.filter(c => c.status === 'Interviewing').length,
          shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
          withVideoResume: candidates.filter(c => c.has_video_resume).length,
          averageAiMatch: candidates.reduce((sum, c) => sum + (c.ai_match_score || 0), 0) / candidates.length
        };

        return res.json({
          success: true,
          data: stats
        });
      }
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Search candidates
router.get('/search/query', async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const { data: candidates, error } = await supabase
      .from('candidates')
      .select('id, name, position, email, location, ai_match_score, status, has_video_resume')
      .or(`name.ilike.%${q}%,position.ilike.%${q}%,email.ilike.%${q}%,skills.cs.{${q}}`)
      .limit(parseInt(limit))
      .order('ai_match_score', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: candidates,
      query: q
    });
  } catch (error) {
    next(error);
  }
});

// Bulk update candidates status
router.patch('/bulk/status', async (req, res, next) => {
  try {
    const { candidateIds, status } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || !status) {
      return res.status(400).json({
        success: false,
        error: 'candidateIds array and status are required'
      });
    }

    const { data, error } = await supabase
      .from('candidates')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .in('id', candidateIds)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: `Updated ${data.length} candidates status to ${status}`,
      data
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 