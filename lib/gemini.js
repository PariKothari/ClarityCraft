export async function fetchGeminiResponse(prompt) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.error(" Gemini API failed:", response.statusText);
      return { reply: "Gemini API error" }; // wrapped in object
    }

    const data = await response.json();
    console.log(" Gemini reply:", data.reply);

    return { reply: data.reply || "No response from Gemini" }; //  consistent return
  } catch (error) {
    console.error(" Fetch error:", error);
    return { reply: "Failed to fetch Gemini response" }; //  consistent fallback
  }
}