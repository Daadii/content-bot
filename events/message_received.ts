import DiscordEvent from "./event";
import {Message} from "discord.js";
import ContentBot, {log4js} from "../index";

export default class MessageReceivedEvent implements DiscordEvent {

    onEvent(e: Message): void {
        log4js.getLogger('MessageReceivedEvent').info(`${e.author.tag} (${e.channel}): ${e.content}`);
        if (e.content.charAt(0) === ContentBot.delimiter) {
            let parts = e.content.split(' ');
            let commands = ContentBot.commands;
            for (let c_key in commands) {
                if (c_key === parts[0].substring(1, parts[0].length)) {
                    commands[c_key].onCommand(e, parts.splice(0, 1))
                }
            }
        }
    }

}