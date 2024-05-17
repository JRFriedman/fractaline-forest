import 'dotenv/config';
import fetch from 'node-fetch';

async function sendRequestToOpenAI(promptText) {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/completions'; // Updated for GPT-3.5-turbo

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        model: 'gpt-3.5-turbo-instruct', 
        prompt: promptText,
        max_tokens: 200,
        // ... other parameters
    };

    try {
        console.log("Sending prompt to OpenAI:", promptText);

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Response from OpenAI:", result);

        return result;
    } catch (error) {
        console.error('Error while calling OpenAI API:', error);
        throw error;
    }
}

export { sendRequestToOpenAI };