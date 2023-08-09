import { CommandInteraction } from "eris";
import { Mongoose } from "mongoose";
import Events from "../events";

function command(interaction: CommandInteraction, db: Mongoose, events: Events) {
    let guild: any = interaction.guildID;
    let rankings = db.models["User"].find({ "servers.serverId": guild }).sort({ "servers": -1 }).limit(10).exec()
    .then((data) => {
        let fields: any = [];
        let i = 0;
        let data2 = data.sort((a: any, b: any) => b.servers.find((e: any) => e.serverId == guild).messageCount - a.servers.find((e: any) => e.serverId == guild).messageCount);
        data.forEach((user: any) => {
            let server = user.servers.find((server: any) => server.serverId == guild);
            let member = events.client.guilds.get(guild)?.members.get(user.id);
            if (member == undefined) events.client.getRESTGuildMember(guild, user.id).then((member) => member);
            i++;
            fields.push({
                name: `${i} - ${member?.username || "Unknown User"}`,
                value: `${i} - Messages: ${server.messageCount}`
            });
        })
        if (fields.length == 0) fields = undefined;
        interaction.createMessage({
            embeds: [{
                title: "Message Rankings",
                fields: fields || {
                    name: "No one has sent any messages!",
                    value: "Send some messages to get on the leaderboard!"
                },
                color: 0x00ff00
            }],
        })
    })
}

let meta = {
  name: "message-rankings",
  description: "See the top 10 users and how many messages they sent!",
  aliases: ["messages", "rankings"],
};

export { meta, command };
