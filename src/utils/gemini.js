import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDPfawahMsNM5LOestci83AYkf74DttoZY"); 

export async function getRecipeInstructions(recipeName) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        Create a clear recipe guide for "${recipeName}". Format it exactly as follows:

        🥘 INGREDIENTS
        • List each ingredient with exact measurements
        • One ingredient per line

        ⏲️ PREPARATION TIME
        • Prep time: [minutes]
        • Cook time: [minutes]
        • Total time: [minutes]

        📝 INSTRUCTIONS
        1. Write each step clearly and concisely
        2. Include specific temperatures and timings
        3. One action per step

        🍽️ SERVING & TIPS
        • Number of servings
        • Garnishing suggestions
        • Storage instructions if applicable

        Keep formatting consistent using bullet points (•) for lists and numbers for steps.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating recipe instructions:', error);
        return "Sorry, I couldn't generate instructions for this recipe at the moment.";
    }
} 