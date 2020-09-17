import Discord, { TextChannel } from "discord.js"
import winston from "winston"
import dotenv from "dotenv"
import TrebWordHandler from "./handlers/TrebWordHandler";
import ResponseHandler from "./handlers/ResponseHandler";
import URLHandler from "./handlers/URLHandler";

dotenv.config()

winston.level = process.env.LOG_LEVEL || "debug"
winston.exitOnError = true
winston.add(new winston.transports.Console({
    format: winston.format.simple(),
}))

const version = require("../package.json").version

const token = process.env.TOKEN
if (!token) {
    winston.error("No token given in $TOKEN")
    process.exit(-1)
}

class Bot {
    private client: Discord.Client

    constructor() {
        this.client = new Discord.Client()

        this.client.on("ready", () => {
            winston.info("Bot connected")

            const permissions = new Discord.Permissions()
            permissions.add(Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY)
            permissions.add(Discord.Permissions.FLAGS.SEND_MESSAGES)
            permissions.add(Discord.Permissions.FLAGS.STREAM)
            permissions.add(Discord.Permissions.FLAGS.SPEAK)
            permissions.add(Discord.Permissions.FLAGS.MANAGE_MESSAGES)

            this.client.generateInvite(permissions).then(invite => {
                winston.info(`Invite link: ${invite}`)
            });
            if (this.client.user) {
                this.client.user.setPresence({activity: {name: `with kids :) | ${version}`}, status: 'online'})
                    .catch(e => winston.error(`Error setting presence\n${e}`))
            } else console.error("Not logged in")
            
        })
        
        const msgHandlers = [
            new TrebWordHandler(),
            new ResponseHandler(),
            new URLHandler()
        ]

        // const voiceHandlers = [
        //     new
        // ]

        this.client.on("message", msg => {
            Promise.all(msgHandlers.map(handler => handler.handleMessage(msg, this.client)))
        })

        // this.client.on("voiceStateUpdate", (oldState, newState) => {
        //     Promise.all(voiceHandlers.map(handler => handler.handleEvent(oldState, newState)))
        // })

        this.login().catch(e =>  winston.error(`Error logging in\n${e}`))
        
    }

    async login() {
        await this.client.login(token)
    }
}

const bot = new Bot()
