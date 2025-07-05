import axios from "axios";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

const analyzeUserDataWithAI = async ({ dreamJob, timePeriod, knowledgeQuestions }) => {
  try {
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set");
    }

    // Prepare the prompt for Grok
    const prompt = createAnalysisPrompt(dreamJob, timePeriod, knowledgeQuestions);

    const response = await axios.post(
      GROK_API_URL,
      {
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content:
              "You are an expert career counselor and learning path designer. Analyze user data and create comprehensive, actionable career roadmaps. Always respond with valid JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("No response from AI service");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      throw new Error("Invalid API key for AI service");
    } else if (error.response?.status === 429) {
      throw new Error("AI service rate limit exceeded");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("AI service request timeout");
    }

    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

const createAnalysisPrompt = (dreamJob, timePeriod, knowledgeQuestions) => {
  const questionsText = knowledgeQuestions
    .map((q, index) => `${index + 1}. ${q.question}\n   Answer: ${q.answer}`)
    .join("\n\n");

  return `
Please analyze this user's career preparation data and create a detailed, personalized roadmap:

**Target Role:** ${dreamJob}
**Preparation Time:** ${timePeriod}

**Current Knowledge Assessment:**
${questionsText}

Based on this information, please provide a comprehensive analysis in the following JSON format:

{
  "skillGapAnalysis": {
    "currentStrengths": ["list of current skills/strengths"],
    "skillsToLearn": ["list of skills to acquire"],
    "criticalGaps": ["most important gaps to address"]
  },
  "learningPath": {
    "phases": [
      {
        "phase": "Phase name",
        "duration": "time duration",
        "focus": "main focus area",
        "skills": ["skills to learn in this phase"],
        "resources": ["specific learning resources"],
        "milestones": ["key achievements/goals"]
      }
    ]
  },
  "priorityAreas": ["most critical areas to focus on"],
  "recommendedResources": {
    "courses": ["online courses"],
    "books": ["recommended books"],
    "projects": ["hands-on projects"],
    "tools": ["tools and platforms"]
  },
  "timeline": {
    "totalDuration": "${timePeriod}",
    "phases": ["breakdown of time allocation"]
  }
}

Make the roadmap specific, actionable, and tailored to their current knowledge level and target role. Ensure the response is valid JSON only.
`;
};

export { analyzeUserDataWithAI };
