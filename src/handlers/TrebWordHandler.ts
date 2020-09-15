import Handler from "./Handler";
import Discord from "discord.js"
import winston from "winston";
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"

const adapter = new FileSync("db.json")
const db = low(adapter)

const trebWords = require("../../config/words_that_are_n.json")

db.defaults({ servers: {} })
    .write()

export default class TrebWordHandler implements Handler {
    async handleMessage(msg: Discord.Message): Promise<void> {
        if (trebWords.some((word: string) => msg.content.includes(word))) {
            if (!msg.guild) return
            db.update(`servers.${msg.guild.id}`, s => s || {users: {}})
            db.update(`servers.${msg.guild.id}.users.${msg.author.id}`, n => n ? n + 1 : 1).write()
            const newCount = db.get(`servers.${msg.guild.id}.users.${msg.author.id}`).value()

            winston.debug(`treb word #${newCount} detected from ${msg.author.username}: ${msg.content.trim()}`)

            const ordinal = newCount % 10 == 1 ? "st" : (newCount % 10 == 2 ? "nd" : newCount % 10 == 3 ? "rd" : "th")

            await msg.reply(new Discord.MessageEmbed({
                title: "treb word detected!",
                description: `${msg.author.tag}'s ${newCount}${ordinal} treb word`
            }))
        }
    }
}