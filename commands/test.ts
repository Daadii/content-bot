import DiscordCommand from "./command";
import {Message} from "discord.js";
import {log4js} from "../index";

export default class TestCommand implements DiscordCommand {
    onCommand(msg: Message, args: string[]) {
        msg.reply('hallo.').catch(log4js.getLogger('TestCommand').error);
    }
}