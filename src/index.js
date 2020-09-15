const Discord = require('discord.js');
const client = new Discord.Client();

const moduleCfg = require('./modules/modules.json')
const cfg = require('../config/config.json')
const responses = require('../config/responses.json')
const version = cfg.version

const modules = Object.keys(moduleCfg).reduce((obj, c) => {
    obj[c] = Object.assign({}, moduleCfg[c], {
        module: require('./modules/' + moduleCfg[c].name)
    })
    return obj
}, {})

client.on('ready', () => {
    client.user.setPresence({ activity: { name: `with kids :) | ${version}`}, status: 'online'})
        .then(console.log)
        .catch(console.error);
    console.log("Logged into server!")
    console.log(`Invite Link: https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
});

client.login(cfg.token);

client.on('message', msg => {
    const content = msg.content.toLowerCase()
    const author = msg.author.id

    // modules go here :)


    // handle per person responses
    if (Object.keys(responses).includes(author)) {
        for (trigger in responses[author]) {
            if (content.includes(trigger)) {
                msg.channel.send(responses[author][trigger])
                return
            }
        }
    } 
    // handle general responses
    for (trigger in responses["general"]) {
        if (content.startsWith(trigger)) {
            msg.reply(responses["general"][trigger])
        }
    }
    // command handling

})

