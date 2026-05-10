const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function main(history) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    // this means only one message is sent fron user to the model
    // contents: msg,

    contents:history,

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
  return response.text;
}

module.exports = main;
