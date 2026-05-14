const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const systemPrompt = `
You are a weather assistant.
Extract only the place/city from user message.
Always respond in this exact JSON format only —
{"place":"city name"}
Do not write anything else — only JSON!
`;

async function main(history , system ) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    // this means only one message is sent fron user to the model
    // contents: msg,
    config: {
      systemInstruction: system ? system : systemPrompt, // ← yahan!
    },
    contents: history,

    // this means prior message is sent from user to the model as an context of the caht
    // contents: [
    //   {
    //     role: "user",
    //     parts: [
    //       {
    //         text: "what's going on buddy",
    //       },
    //     ],
    //   },
    //   {
    //     role: "model",
    //     parts: [
    //       {
    //         text: "Really feeling good and fun",
    //       },
    //     ],
    //   },
    //   {
    //     role: "user",
    //     parts: [
    //       {
    //         text: "What is the current weather in Virar",
    //       },
    //     ],
    //   },
    // ],
  });
  console.log(response.text);
  console.log(typeof response.text);

  return response.text;
}

module.exports = main;
