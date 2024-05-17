import { sendRequestToOpenAI } from "../api.js";

export async function fetchData() {
  const NEYNAR_API_KEY = import.meta.env.NEYNAR_API_KEY;
  const URL = "https://api.neynar.com/v1/farcaster/casts?fid=3&limit=6";
  const headersX = {
    accept: "application/json",
    api_key: NEYNAR_API_KEY,
  };

  try {
    const responseNeynar = await fetch(URL, { headers: headersX });
    const dataNeynar = await responseNeynar.json();
    const casts = dataNeynar.result.casts;

    const allCastsText = casts.map((cast) => cast.text).join(" ");

    const openAIResponse = await sendRequestToOpenAI(
      `You are Vector, the wolf guide, known for your insightful yet concise greetings. With just a few words, you reflect the essence of new arrivals in the Fractaline Forest. Drawing from the player's latest thoughts, craft a brief welcome that hints at their inner world, starting with 'Welcome, traveler'. Keep your message under 15 words, and make reference to at least one of the messages in: ${allCastsText}.`
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
