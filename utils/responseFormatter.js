const formatRoadmapResponse = (aiResponse, userInput) => {
    return {
      id: generateRoadmapId(),
      dreamJob: userInput.track,
      timePeriod: userInput.timeline,
      targetCompanies: userInput.targetCompanies,
      createdAt: new Date().toISOString(),
      roadmap: aiResponse,
      userProfile: {
        skillLevel: userInput.skillLevel,
        technologies: userInput.technologies,
        dsaInvolvement: userInput.dsaInvolvement,
        experience: userInput.experience,
        timeCommitment: userInput.timeCommitment,
        currentProjects: userInput.currentProjects,
        integrations: userInput.integrations
      },
      metadata: {
        aiModel: "grok-beta",
        version: "1.0",
        processingTime: new Date().toISOString(),
      },
    };
  };
  
  const generateRoadmapId = () => {
    return "roadmap_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  };
  
  export { formatRoadmapResponse };
  