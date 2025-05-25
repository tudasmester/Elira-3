import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Ensure we have an API key
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API key is missing");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" // Provide empty string as fallback for TypeScript
});

export interface CareerPathInfo {
  title: string;
  description: string;
  keySkills: string[];
  learningPath: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  demandTrend: string;
  recommendedCourses: {
    title: string;
    provider: string;
    level: string;
  }[];
  relatedCareers: string[];
}

export async function generateCareerPathInfo(careerPath: string): Promise<CareerPathInfo> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a career development expert specializing in Hungarian job market trends. Provide detailed career path information in Hungarian, formatted as JSON. Focus on realistic skills, learning paths, and salary expectations for the Hungarian market.",
        },
        {
          role: "user",
          content: `Generate detailed career path information for a "${careerPath}" career in Hungary. Include key skills, learning path stages, salary ranges in HUF, current demand trends, recommended courses available in Hungary, and related careers. Format response as JSON.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as CareerPathInfo;
  } catch (error) {
    console.error("Error generating career path info:", error);
    
    // Return a default error response
    return {
      title: careerPath,
      description: "Az információ betöltése sikertelen. Kérjük, próbálja újra később.",
      keySkills: ["Információ nem elérhető"],
      learningPath: {
        beginner: ["Információ nem elérhető"],
        intermediate: ["Információ nem elérhető"],
        advanced: ["Információ nem elérhető"],
      },
      salaryRange: {
        entry: "Nem elérhető",
        mid: "Nem elérhető",
        senior: "Nem elérhető",
      },
      demandTrend: "Nem elérhető",
      recommendedCourses: [
        {
          title: "Információ nem elérhető",
          provider: "Nem elérhető",
          level: "Nem elérhető",
        },
      ],
      relatedCareers: ["Információ nem elérhető"],
    };
  }
}

export async function getCareerRecommendation(
  interests: string[], 
  skills: string[], 
  background: string
): Promise<{ careers: string[], explanation: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor specializing in the Hungarian job market. Your task is to recommend suitable career paths based on user interests, skills, and background. Provide thoughtful explanations for your recommendations in Hungarian.",
        },
        {
          role: "user",
          content: `Based on the following information, recommend 3-5 career paths available in Hungary:
            Interests: ${interests.join(", ")}
            Skills: ${skills.join(", ")}
            Background: ${background}
            
            Respond in JSON format with: 
            1. An array of career names
            2. A brief explanation of why each career is suitable
            `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as { careers: string[], explanation: string };
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return {
      careers: ["Adatelemző", "Szoftverfejlesztő", "Projektmenedzser"],
      explanation: "Ajánlások generálása sikertelen. Kérjük, próbálja újra később."
    };
  }
}

export async function generateSkillsAnalysis(
  currentSkills: string[], 
  targetCareer: string
): Promise<{ 
  matchScore: number, 
  strengths: string[], 
  gaps: string[], 
  recommendations: string[] 
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a career skills analyst specializing in the Hungarian job market. Your task is to analyze how a user's current skills align with their target career path, identify strengths and gaps, and provide actionable recommendations for skill development.",
        },
        {
          role: "user",
          content: `Analyze the following skills for a person interested in pursuing a career as a "${targetCareer}" in Hungary:
            Current Skills: ${currentSkills.join(", ")}
            
            Respond in JSON format with: 
            1. A match score (0-100) indicating how well their current skills align with the target career
            2. A list of their current strengths relative to the career
            3. A list of skill gaps they need to address
            4. Specific recommendations for skill development
            `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as { 
      matchScore: number, 
      strengths: string[], 
      gaps: string[], 
      recommendations: string[] 
    };
  } catch (error) {
    console.error("Error generating skills analysis:", error);
    return {
      matchScore: 50,
      strengths: ["Jelenlegi készségek elemzése nem elérhető"],
      gaps: ["Készséghiányok elemzése nem elérhető"],
      recommendations: ["Ajánlások generálása sikertelen. Kérjük, próbálja újra később."]
    };
  }
}