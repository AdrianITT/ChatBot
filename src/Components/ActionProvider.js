// src/ActionProvider.js

class ActionProvider {
     constructor(createChatBotMessage, setStateFunc, createCustomMessage) {
       this.createChatBotMessage = createChatBotMessage;
       this.setState = setStateFunc;
       this.createCustomMessage = createCustomMessage;
     }
   
     handleHello() {
       const message = this.createChatBotMessage("¡Hola! ¿Cómo estás?");
       this.setState(prevState => ({
         ...prevState,
         messages: [...prevState.messages, message],
       }));
     }
   
     handleGoodbye() {
       const message = this.createChatBotMessage("¡Adiós! ¡Hasta luego!");
       this.setState(prevState => ({
         ...prevState,
         messages: [...prevState.messages, message],
       }));
     }
   }
   
   export default ActionProvider;
   