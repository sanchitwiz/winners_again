import express from "express";
import { generateRoadmap } from "../controllers/roadmapController.js";
import { validateRoadmapInput } from "../middleware/validation.js";

const router = express.Router();

// POST /api/roadmap/generate
router.post("/generate", validateRoadmapInput, generateRoadmap);

export default router;
