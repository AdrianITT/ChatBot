import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";
import { Plugin } from "../types/Plugin";
/**
 * Determines if user gave a provider or if one needs to be created, before rendering the chatbot.
 *
 * @param id id to uniquely identify the chatbot
 * @param flow conversation flow for the bot
 * @param settings settings to setup the bot
 * @param styles styles to setup the bot
 * @param themes themes to apply to the bot
 * @param plugins plugins to initialize
 */
declare const ChatBot: ({ id, flow, settings, styles, themes, plugins, }: {
    id?: string;
    flow?: Flow;
    settings?: Settings;
    styles?: Styles;
    themes?: Theme | Array<Theme>;
    plugins?: Array<Plugin>;
}) => import("react/jsx-runtime").JSX.Element;
export default ChatBot;
//# sourceMappingURL=ChatBot.d.ts.map