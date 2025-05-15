// src/chatbotConfig.js

import React from "react";

const config = {
  botName: "ChatBot",
  initialMessages: [
    {
      text: "¡Hola! Soy un chatbot. ¿Cómo te puedo ayudar hoy?",
      sender: "bot",
    },
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5C6BC0",
    },
  },
};

export default config;
