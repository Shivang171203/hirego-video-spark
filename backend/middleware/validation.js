const Joi = require('joi');

// Validation schema for creating a new candidate
const createCandidateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  position: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Position must be at least 2 characters long',
      'string.max': 'Position cannot exceed 100 characters',
      'any.required': 'Position is required'
    }),
  
  experience_years: Joi.number().min(0).max(50).required()
    .messages({
      'number.min': 'Experience years cannot be negative',
      'number.max': 'Experience years cannot exceed 50',
      'any.required': 'Experience years is required'
    }),
  
  location: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Location must be at least 2 characters long',
      'string.max': 'Location cannot exceed 100 characters',
      'any.required': 'Location is required'
    }),
  
  ai_match_score: Joi.number().min(0).max(100).default(0)
    .messages({
      'number.min': 'AI match score cannot be negative',
      'number.max': 'AI match score cannot exceed 100'
    }),
  
  status: Joi.string().valid('Active', 'Interviewing', 'Shortlisted', 'Rejected', 'Hired').default('Active')
    .messages({
      'any.only': 'Status must be one of: Active, Interviewing, Shortlisted, Rejected, Hired'
    }),
  
  has_video_resume: Joi.boolean().default(false),
  
  rating: Joi.number().min(0).max(5).default(0)
    .messages({
      'number.min': 'Rating cannot be negative',
      'number.max': 'Rating cannot exceed 5'
    }),
  
  skills: Joi.array().items(Joi.string().min(1).max(50)).min(1).max(20).default([])
    .messages({
      'array.min': 'At least one skill is required',
      'array.max': 'Cannot have more than 20 skills',
      'string.min': 'Skill name must be at least 1 character',
      'string.max': 'Skill name cannot exceed 50 characters'
    }),
  
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  linkedin_url: Joi.string().uri().optional()
    .messages({
      'string.uri': 'Please provide a valid LinkedIn URL'
    }),
  
  github_url: Joi.string().uri().optional()
    .messages({
      'string.uri': 'Please provide a valid GitHub URL'
    }),
  
  portfolio_url: Joi.string().uri().optional()
    .messages({
      'string.uri': 'Please provide a valid portfolio URL'
    }),
  
  notes: Joi.string().max(1000).optional()
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

// Validation schema for updating a candidate
const updateCandidateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  position: Joi.string().min(2).max(100).optional(),
  experience_years: Joi.number().min(0).max(50).optional(),
  location: Joi.string().min(2).max(100).optional(),
  ai_match_score: Joi.number().min(0).max(100).optional(),
  status: Joi.string().valid('Active', 'Interviewing', 'Shortlisted', 'Rejected', 'Hired').optional(),
  has_video_resume: Joi.boolean().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  skills: Joi.array().items(Joi.string().min(1).max(50)).min(1).max(20).optional(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  linkedin_url: Joi.string().uri().optional(),
  github_url: Joi.string().uri().optional(),
  portfolio_url: Joi.string().uri().optional(),
  notes: Joi.string().max(1000).optional()
});

// Middleware to validate candidate creation
const validateCandidate = (req, res, next) => {
  const { error, value } = createCandidateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    });
  }

  // Set validated data
  req.body = value;
  next();
};

// Middleware to validate candidate updates
const validateCandidateUpdate = (req, res, next) => {
  const { error, value } = updateCandidateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    });
  }

  // Set validated data
  req.body = value;
  next();
};

module.exports = {
  validateCandidate,
  validateCandidateUpdate
}; 