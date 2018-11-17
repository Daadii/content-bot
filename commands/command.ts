import {Message} from "discord.js";
import ContentBot from "../index";
import {Logger} from "log4js";

export default interface DiscordCommand {
    onCommand(msg: Message, args: string[]);
}

export function sendInvalidArgsMessage(msg: Message, syntax: string, logger: Logger) {
    msg.channel.send(':x: Ungültige Argumente! Syntax: ' + ContentBot.delimiter + syntax).catch(logger.error);
}