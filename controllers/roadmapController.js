import { analyzeUserDataWithAI } from "../services/aiService.js";
import { formatRoadmapResponse } from "../utils/responseFormatter.js";

const generateRoadmap = async (req, res) => {
  try {
    const userInput = req.body;

    // Transform frontend data to match AI service expectations
    const aiServiceInput = {
      dreamJob: userInput.track === "faang" ? "FAANG Software Engineer" : userInput.track,
      timePeriod: userInput.timeline,
      knowledgeQuestions: [
        {
          question: "What is your current skill level?",
          answer: userInput.skillLevel
        },
        {
          question: "What technologies do you know?",
          answer: userInput.technologies.join(", ")
        },
        {
          question: "What is your DSA involvement level?",
          answer: userInput.dsaInvolvement
        },
        {
          question: "What projects have you worked on?",
          answer: userInput.currentProjects
        },
        {
          question: "What is your experience level?",
          answer: userInput.experience
        },
        {
          question: "How much time can you commit weekly?",
          answer: `${userInput.timeCommitment} hours per week`
        }
      ]
    };

    // Get AI analysis
    const aiAnalysis = await analyzeUserDataWithAI(aiServiceInput);
    
    // Parse AI response if it's a string
    let parsedAnalysis;
    try {
      parsedAnalysis = typeof aiAnalysis === 'string' ? JSON.parse(aiAnalysis) : aiAnalysis;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to mock data if AI parsing fails
      parsedAnalysis = {
        skillGapAnalysis: {
          currentStrengths: userInput.technologies,
          skillsToLearn: ["System Design", "Advanced DSA", "System Architecture"],
          criticalGaps: ["Interview Preparation", "Coding Practice"]
        },
        learningPath: {
          phases: [
            {
              phase: "Foundation Phase",
              duration: "1 month",
              focus: "Strengthen core concepts",
              skills: userInput.technologies,
              resources: ["LeetCode", "System Design Primer", "Cracking the Coding Interview"],
              milestones: ["Complete 100 DSA problems", "Build 2 projects"]
            },
            {
              phase: "Advanced Phase",
              duration: "2 months",
              focus: "Interview preparation and system design",
              skills: ["System Design", "Advanced Algorithms", "Behavioral Interview"],
              resources: ["Grokking System Design", "Mock Interviews", "System Design Primer"],
              milestones: ["Complete system design course", "Practice 50 system design problems"]
            }
          ]
        },
        priorityAreas: ["Data Structures & Algorithms", "System Design", "Behavioral Interview"],
        recommendedResources: {
          courses: ["LeetCode Premium", "System Design Interview Course"],
          books: ["Cracking the Coding Interview", "System Design Interview"],
          projects: ["Build a distributed system", "Create a scalable web application"],
          tools: ["LeetCode", "Pramp", "InterviewBit"]
        }
      };
    }

    // Format the response
    const roadmap = formatRoadmapResponse(parsedAnalysis, userInput);

    res.status(200).json({
      success: true,
      data: roadmap,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate roadmap",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export { generateRoadmap };
