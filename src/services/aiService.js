// src/services/aiService.js

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-flash-latest";

export const getGeminiResponse = async (userPrompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Saathi AI, a helpful government scheme assistant for Indian citizens. 
                  Provide concise, accurate information about government schemes, eligibility, and documentation.
                  If you don't know something, suggest the user to check the 'Benefit Hunter' section.
                  
                  User query: ${userPrompt}`
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later or check our scheme directory.";
  }
};
export const analyzeAppeal = async (text, name) => {
  try {
    const prompt = `You are a legal and government policy expert. Analyze the following rejection text for a government scheme.
    Applicant Name: ${name}
    Rejection Text: ${text}
    
    Return your response as a JSON object with the following fields:
    - reason: A short 1-line reason for rejection.
    - explanation: A simple 2-3 sentence explanation of what went wrong.
    - next_steps: An array of 3 actionable steps to fix the issue.
    - authority: The name of the department to appeal to.
    - appeal: A formal, well-structured appeal letter text (about 200 words).
    
    IMPORTANT: Respond ONLY with the JSON object, no other text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    let content = data.candidates[0].content.parts[0].text;
    
    // Cleanup JSON in case Gemini adds markdown blocks
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing appeal:", error);
    // Fallback mock result if AI fails
    return {
      reason: "Document Inconsistency",
      explanation: "There seems to be a mismatch between your profile details and the documents uploaded.",
      next_steps: ["Verify Aadhaar link", "Get new income certificate", "Visit local office"],
      authority: "Department of Social Welfare",
      appeal: "Respected Authority, I am writing to appeal the rejection..."
    };
  }
};

export const verifyDocument = async (base64Data, mimeType, expectedType) => {
  try {
    const prompt = `You are a document verification AI for the Indian Government.
    Your task is to verify if the uploaded document is a valid "${expectedType}".
    
    Rules for Verification:
    - If expected is "Aadhaar Card", look for keywords like "Aadhaar", "UIDAI", "Government of India", or a 12-digit format.
    - If expected is "PAN Card", look for "Income Tax Department", "PAN", or the ABCDE1234F format.
    - If expected is "Income Certificate", look for "Income Certificate", "Tehsildar", "Revenue Department".
    - If the document is clearly something else (e.g., a random photo, a blank page, or a completely different document type), mark it as invalid.
    
    Return your response strictly as a JSON object with the following fields:
    - isValid: boolean (true if it matches the expected type, false otherwise)
    - reason: string (A short 1-line reason, e.g., "Valid Aadhaar Card detected." or "Incorrect document uploaded (Expected: ${expectedType}).")
    
    IMPORTANT: Respond ONLY with the JSON object, no markdown, no other text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType
                }
              }
            ]
          }],
        }),
      }
    );

    const data = await response.json();
    let content = data.candidates[0].content.parts[0].text;
    
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(content);
  } catch (error) {
    console.error("Error verifying document with AI:", error);
    return {
      isValid: false,
      reason: "Verification service temporarily unavailable."
    };
  }
};
