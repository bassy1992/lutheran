
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly in the named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHURCH_CONTEXT = `
You are 'GraceBot', the spiritual assistant for Trinity Lutheran Church Ghana. 
Trinity Lutheran Church is part of the Evangelical Lutheran Church of Ghana (ELCG).
Our core values are:
1. Sola Gratia (Grace Alone)
2. Sola Fide (Faith Alone)
3. Sola Scriptura (Scripture Alone)

Church Information:
- Location: Accra, Ghana (Main Branch).
- Head Pastor: Rev. John Mensah (Placeholder).
- Service Times: Sundays 8:00 AM, Wednesdays 6:00 PM, Fridays 7:00 PM.
- Mission: To spread the Gospel of Jesus Christ across Ghana and beyond.

Guidelines:
- Be warm, welcoming, and spiritually encouraging.
- Provide information about Lutheran beliefs if asked.
- Direct users to the 'Contact' page for specific counseling needs.
- If users ask about events, mention that we have an 'Events' section on the website.
- Keep responses concise and respectful.
`;

export const chatWithGraceBot = async (message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // contents should only contain conversation turns
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        // Use systemInstruction for defining persona and rules
        systemInstruction: CHURCH_CONTEXT,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    // Access the text property directly from the response
    return response.text;
  } catch (error) {
    console.error("GraceBot Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again or visit our Contact page.";
  }
};
