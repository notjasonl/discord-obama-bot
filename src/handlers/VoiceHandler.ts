import Discord from "discord.js"

export default interface VoiceHandler {
    handleEvent(oldState: Discord.VoiceState, newState: Discord.VoiceState): Promise<void>
}