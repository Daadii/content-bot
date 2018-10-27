import {Message} from "discord.js";

export default interface DiscordCommand {
    onCommand(msg: Message, args: string[]);
}