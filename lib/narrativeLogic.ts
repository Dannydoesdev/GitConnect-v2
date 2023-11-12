// lib/narrativeLogic.ts

type ProjectNarrative = {
  title?: string;
  overview?: string;
  role?: string;
  challenges?: string[];
  solutions?: string[];
  technologies?: string[];
  learnings?: string;
  repositoryLink?: string;
};

type SessionData = {
  narrative: ProjectNarrative;
  lastQuestionAsked?: string;
};

export const initializeSessionData = (): SessionData => {
  return {
    narrative: {
      challenges: [],
      solutions: [],
      technologies: [],
    },
  };
};

export const processUserMessage = (message: string, sessionData: SessionData): SessionData => {
  // Here you would include logic to interpret user's message
  // For example, if the last question was about the project title and the user answered, save it
  if (sessionData.lastQuestionAsked === 'title') {
    sessionData.narrative.title = message;
  }
  // if (sessionData.lastQuestionAsked === 'repositoryLink') {
  //   sessionData.narrative.repositoryLink = message;
  // }
  if (sessionData.lastQuestionAsked === 'role') {
    sessionData.narrative.role = message;
  }
  if (sessionData.lastQuestionAsked === 'overview') {
    sessionData.narrative.overview = message;
  }
  if (sessionData.lastQuestionAsked === 'challenges') {
    sessionData.narrative.challenges?.push(message);
  }
  if (sessionData.lastQuestionAsked === 'solutions') {
    sessionData.narrative.solutions?.push(message);
  } 
  if (sessionData.lastQuestionAsked === 'technologies') {
    sessionData.narrative.technologies?.push(message);
  }
  if (sessionData.lastQuestionAsked === 'learnings') {
    sessionData.narrative.learnings = message;
  }

  return sessionData; // return the updated session data
};

export const determineNextQuestion = (sessionData: SessionData): string => {
  // Decide the next question to ask based on what information is missing
  if (!sessionData.narrative.title) {
    sessionData.lastQuestionAsked = 'title';
    return "What's the title of your project?";
  }
  if (!sessionData.narrative.role) {
    sessionData.lastQuestionAsked = 'role';
    return "What was your role in this project?";
  }
  
  if (!sessionData.narrative.overview) {
    sessionData.lastQuestionAsked = 'overview';
    return "Can you give an overview of your project?";
  }
  if (!sessionData.narrative.challenges?.length) {
    sessionData.lastQuestionAsked = 'challenges';
    return "What were some challenges you faced?";
  }
  if (!sessionData.narrative.solutions?.length) {
    sessionData.lastQuestionAsked = 'solutions';
    return "How did you overcome these challenges?";
  }
  if (!sessionData.narrative.technologies?.length) {
    sessionData.lastQuestionAsked = 'technologies';
    return "What technologies did you use?";
  }
  if (!sessionData.narrative.learnings) {
    sessionData.lastQuestionAsked = 'learnings';
    return "What did you learn from this project?";
  }


  return "That's all the information we need. Thank you!";
};

// Include other necessary functions for different aspects of the narrative
