import { sendRequestToOpenAI } from "../api.js";

export async function fetchData(fid) {
  const NEYNAR_API_KEY = import.meta.env.NEYNAR_API_KEY;
  const URL = `https://api.neynar.com/v1/farcaster/casts?fid=${fid}&limit=6`;
  const headersX = {
    accept: "application/json",
    api_key: NEYNAR_API_KEY,
  };

  try {
    console.log(`Fetching data with fid: ${fid}`); // Debugging line to check fid
    const responseNeynar = await fetch(URL, { headers: headersX });
    const dataNeynar = await responseNeynar.json();
    const casts = dataNeynar.result.casts;

    const allCastsText = casts.map((cast) => cast.text).join(" ");

    const openAIResponse = await sendRequestToOpenAI(
      `You are Vector, the wolf guide, who knows the soul of each traveler. Craft a brief welcoming question that hints at the inner world of the new arrival, beginning with 'Welcome, traveler'. Keep your message under 18 words, and refer to at least one of the thoughts in: ${allCastsText}.`
    );

    let firstChoiceText = "";
    if (
      openAIResponse &&
      openAIResponse["choices"] &&
      openAIResponse["choices"].length > 0
    ) {
      const fullText = openAIResponse["choices"][0].text;
      const textParts = fullText.split("\n\nWelcome, traveler");

      if (textParts.length > 1) {
        firstChoiceText = "Welcome, traveler" + textParts[1].trim();
      } else {
        console.error("Separator not found in text");
        firstChoiceText = fullText.trim();
      }
    } else {
      console.error("No response or empty choices array from OpenAI");
    }

    return { casts, firstChoiceText };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { casts: [], firstChoiceText: "" };
  }
}
