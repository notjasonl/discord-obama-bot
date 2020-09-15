import Handler from "./Handler";
import Discord from "discord.js";
import winston from "winston";

const prefix = process.env.PREFIX || "-"

type Command = (args: string[], msg: Discord.Message) => void

export default class CommandHandler implements Handler {
    async handleMessage(msg: Discord.Message): Promise<void> {
        if (msg.content.startsWith(prefix)) {
            const strippedContent = msg.content.split(prefix)[1]
            const splitCommand = strippedContent.split(" ")

            const command = splitCommand[0]
            const args = splitCommand.slice(1)
        }
    }
}