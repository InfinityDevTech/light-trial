import { CommandInteraction } from "eris";
import { Mongoose } from "mongoose";

function command(interaction: CommandInteraction, db: Mongoose) {
    if (interaction.member && interaction.member.permissions.has("manageGuild")) {
    let data: any = interaction.data;
    let channel = data.options[0].value;
    if (data.resolved.channels.get(channel) && data.resolved.channels.get(channel).type == 0) {
    db.models.Server.findOneAndUpdate({id: interaction.guildID}, {welcomeChannel: channel}, {upsert: true}).then(() => {
        interaction.createMessage({
            embeds: [{
                title: "Welcome Channel",
                description: `Set the welcome channel to <#${channel}>!`,
                color: 0x00ff00
            }],
            flags: 64
        })
    })
} else {
    interaction.createMessage({
        embeds: [{
            title: "Welcome Channel",
            description: "That channel doesn't exist or isn't a text channel!",
            color: 0xff0000
        }],
        flags: 64
    })
}
} else {
    interaction.createMessage({
        embeds: [{
            title: "Welcome Channel",
            description: "You don't have permission to use this command!",
            color: 0xff0000
        }],
        flags: 64
    })
}
}

let meta = {
    name: "set-welcome",
    description: "Set the channel the welcome message is sent to!",

    options: [{
        type: 7,
        name: "channel",
        description: "The channel to send the welcome message to",
        required: true
    }],
    aliases: ["set-welcome-channel", "welcome"]
}

export {meta, command};