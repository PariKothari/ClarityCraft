export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prompt = req.body.prompt;

  if (!prompt) {
    console.error(" Missing prompt");
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error(" Gemini API failed:", response.status, response.statusText);
      return res.status(500).json({ reply: "Gemini API error" });
    }

    const data = await response.json();
    console.log(" Gemini raw response:", data);

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(" Server error:", err);
    res.status(500).json({ reply: "Internal server error" });
  }
}