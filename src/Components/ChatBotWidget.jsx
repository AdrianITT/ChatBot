// src/ChatBot.js
import React from "react";
import Chatbot from "react-chatbot-kit";
import config from "./chatbotConfig";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const ChatBot = () => {
  return (
    <div>
      <Chatbot
        config={config}
        actionProvider={ActionProvider}
        messageParser={MessageParser}
      />
    </div>
  );
};

export default ChatBot;
