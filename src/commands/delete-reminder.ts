import { CommandInteraction } from "eris";
import { Mongoose } from "mongoose";
import Events from "../events";

function command(interaction: CommandInteraction, db: Mongoose, events: Events) {
    if (interaction.member && interaction.member.permissions.has("manageGuild") && interaction.guildID != undefined) {
        let data: any = interaction.data;
        db.models["Cron"].findOneAndDelete({ id: interaction.guildID }).then(() => {
            interaction.createMessage({
            embeds: [{
                title: "Reminder",
                description: `Deleted the reminder!`,
                color: 0x00ff00,
            }],
            flags: 64,
            });
            //@ts-ignore
            events.stopCron(interaction.guildID);
        });
    } else {
        interaction.createMessage({
        embeds: [{
            title: "Reminder",
            description: "You don't have permission to use this command!",
            color: 0xff0000,
        }],
        flags: 64,
        });
    }
}

let meta = {
  name: "delete-reminder",
  description: "Delete a reminder!",
  aliases: ["remove-reminder", "unreminder"],
};

export { meta, command };
