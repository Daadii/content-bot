import {Client} from "discord.js";
import MessageReceivedEvent from "./events/message_received";
import TestCommand from "./commands/test";
import RausCommand from "./commands/raus";

export const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: {type: 'file', filename: 'contentbot.log', flags: 'w'},
        console: {type: 'console'}
    },
    categories: {
        default: {appenders: ['out', 'console'], level: 'info'}
    }
});

require('fs').readFile('./token.txt', (err, data) => {
    if (err) throw err;
    new ContentBot(data.toString('UTF-8'));
});

export default class ContentBot {
    private readonly discord = require('discord.js');
    private readonly discord_client: Client = new this.discord.Client();
    private readonly logger = log4js.getLogger('ContentBot');
    public static readonly delimiter: string = '!';
    public static readonly commands = {
        'test': new TestCommand(),
        'raus': new RausCommand()
    };
    public static readonly events = {
        'message': new MessageReceivedEvent()
    };

    constructor(private bot_token: string) {
        this.discord_client.on('ready', () => {
            this.logger.info(`Successfully logged in as ${this.discord_client.user.tag}`);
            this.registerEvents();
        });
        this.discord_client.login(bot_token).catch((err) => {
            throw err;
        });
    }

    private registerEvents(): void {
        for (let e_key in ContentBot.events) {
            let e_val = ContentBot.events[e_key];
            this.discord_client.on(e_key, e_val.onEvent);
            this.logger.info(`Successfully registered event for '${e_key}': ${e_val.constructor.name}`)
        }
    }
}