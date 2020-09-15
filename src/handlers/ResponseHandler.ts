import Handler from "./Handler";
import Discord from "discord.js";
import winston from "winston";

const responses = require('../config/responses.json')

export default class ResponseHandler implements Handler {
    async handleMessage(msg: Discord.Message): Promise<void> {
        const content = msg.content.toLowerCase()
        const author = msg.author.id

        // handle per person responses
        if (Object.keys(responses).includes(author)) {
            for (const trigger in responses[author]) {
                if (content.includes(trigger)) {
                    await msg.reply(responses[author][trigger])
                    return
                }
            }
        }

        // handle general responses
        for (const trigger in responses["general"]) {
            if (content.startsWith(trigger)) {
                await msg.reply(responses["general"][trigger])
            }
        }
    }
}