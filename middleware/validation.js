import Joi from "joi";

const roadmapRequestSchema = Joi.object({
  track: Joi.string().required().messages({
    "string.empty": "Track is required",
    "any.required": "Track field is required"
  }),
  skillLevel: Joi.string().required().messages({
    "string.empty": "Skill level is required",
    "any.required": "Skill level field is required"
  }),
  technologies: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Technologies must be an array",
    "any.required": "Technologies field is required"
  }),
  dsaInvolvement: Joi.string().required().messages({
    "string.empty": "DSA involvement is required",
    "any.required": "DSA involvement field is required"
  }),
  currentProjects: Joi.string().required().messages({
    "string.empty": "Current projects is required",
    "any.required": "Current projects field is required"
  }),
  experience: Joi.string().required().messages({
    "string.empty": "Experience is required",
    "any.required": "Experience field is required"
  }),
  timeCommitment: Joi.string().required().messages({
    "string.empty": "Time commitment is required",
    "any.required": "Time commitment field is required"
  }),
  timeline: Joi.string().required().messages({
    "string.empty": "Timeline is required",
    "any.required": "Timeline field is required"
  }),
  targetCompanies: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Target companies must be an array",
    "any.required": "Target companies field is required"
  }),
  integrations: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Integrations must be an array",
    "any.required": "Integrations field is required"
  })
});

const validateRoadmapInput = (req, res, next) => {
  const { error } = roadmapRequestSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.details.map(detail => detail.message)
    });
  }

  next();
};

export { validateRoadmapInput };
