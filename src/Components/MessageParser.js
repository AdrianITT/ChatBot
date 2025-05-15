// src/MessageParser.js

class MessageParser {
     constructor(actionProvider, createChatBotMessage) {
       this.actionProvider = actionProvider;
       this.createChatBotMessage = createChatBotMessage;
     }
   
     parse(message) {
       if (message.includes("hola")) {
         this.actionProvider.handleHello();
       }
   
       if (message.includes("adiós")) {
         this.actionProvider.handleGoodbye();
       }
     }
   }
   
   export default MessageParser;
   