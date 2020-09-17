import Handler from "./Handler";
import Discord from "discord.js";
import winston from "winston";

export default class SlowModeHandler implements Handler {
    async handleMessage(msg: Discord.Message, client?: Discord.Client): Promise<void> {
        const content = msg.content.toLowerCase()
        const author = msg.author.id

        
    }
}
