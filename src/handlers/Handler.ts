import Discord from "discord.js"

export default interface Handler {
    handleMessage(msg: Discord.Message, client?: Discord.Client): Promise<void>
}