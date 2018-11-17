import {Client} from 'discord.js';
import MessageReceivedEvent from './events/message_received';
import TestCommand from './commands/test';
import RausCommand from './commands/raus';
import I18n from './i18n';
import LanguageCommand from "./commands/language";
import HelpCommand from "./commands/help";

// Load and configure Log4js Logger
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

let fs = require('fs');
let logger = log4js.getLogger('BotInitializer');

// Load langfiles and configure i18n module
fs.access('./lang', (err) => {
    if (err) logger.error(`Lang folder not found, running without string messages! ${err}`);
});
fs.readdir('./lang', ['utf-8', true], (err, files) => {
    if (err) {
        logger.error(`Error while reading langfiles, running without string messages! ${err}`);
        return;
    }
    let langfiles: string[] = [];
    for (let i = 0; i < files.length; i++) {
        langfiles.push(files[i]);
    }

    let langfilecontents: { [langfile: string]: string } = {};
    for (let i in langfiles) {
        let data = fs.readFileSync('./lang/' + langfiles[i]);
        langfilecontents[langfiles[i].split('.')[0]] = data.toString('utf-8');
    }

    new I18n(langfilecontents, 'de_DE');
    logger.info('Successfully initialized i18n module');
});


// Load Discord Bot Token and boot Discord Bot
fs.readFile('./token.txt', (err, data) => {
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
        'raus': new RausCommand(),
        'language': new LanguageCommand(),
        'help': new HelpCommand()
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