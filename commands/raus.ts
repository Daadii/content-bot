import DiscordCommand, {sendInvalidArgsMessage} from "./command";
import {Message} from "discord.js";
import {log4js} from "../index";

export default class RausCommand implements DiscordCommand {
    onCommand(msg: Message, args: string[]) {
        let logger = log4js.getLogger('RausCommand');
        if (args.length === 0) {
            msg.channel.send('(:point_right: ͡° ͜ʖ ͡°):point_right: :door:').catch(logger.error);
            msg.delete().catch(logger.error);
        } else {
            sendInvalidArgsMessage(msg, 'raus', logger);
        }
    }

}