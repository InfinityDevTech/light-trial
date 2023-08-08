import { CommandInteraction } from "eris";
import { Mongoose } from "mongoose";
import Events from "../events";

function command(
  interaction: CommandInteraction,
  db: Mongoose,
  events: Events
) {
  let data: any = interaction.data;
  let channel = data.options[0].value;
  let message = data.options[1].value;
  let minute = data.options[2] ? data.options[2].value : "*";
  let hour = data.options[3] ? data.options[3].value : "*";
  let day = data.options[4] ? data.options[4].value : "*";
  let month = data.options[5] ? data.options[5].value : "*";
  let week = data.options[6] ? data.options[6].value : "*";
  if (
    data.resolved.channels.get(channel) &&
    data.resolved.channels.get(channel).type == 0 &&
    interaction.guildID != undefined
  ) {
    db.models["Cron"].findOneAndUpdate(
      { id: interaction.guildID },
      {
        id: interaction.guildID,
        channel: channel,
        message: message,
        cron: `${minute} ${hour} ${day} ${month} ${week}`,
      },
      { upsert: true }
    ).then(() => {
      interaction.createMessage({
        embeds: [
          {
            title: "Reminder",
            description: `Set the reminder to <#${channel}>!`,
            color: 0x00ff00,
          },
        ],
        flags: 64,
      });
      events.startCron(
        channel,
        message,
        `${minute} ${hour} ${day} ${month} ${week}`,
        //@ts-ignore
        interaction.guildID
      );
    });
  } else {
    interaction.createMessage({
      embeds: [
        {
          title: "Reminder",
          description: "That channel doesn't exist or isn't a text channel!",
          color: 0xff0000,
        },
      ],
      flags: 64,
    });
  }
}

let meta = {
  name: "set-reminder",
  description: "Set a reminder!",

  options: [
    {
      type: 7,
      name: "channel",
      description: "The channel to send the reminder message to",
      required: true,
    },
    {
      type: 3,
      name: "message",
      description: "The message to send",
      required: true,
    },
    {
      type: 4,
      name: "minute",
      description: "The minute to send the message",
      min_value: "0",
      max_value: "59",
    },
    {
      type: 4,
      name: "hour",
      description: "The hour to send the message",
      min_value: "0",
      max_value: "23",
    },
    {
      type: 4,
      name: "day",
      description: "The day of the month to send the message",
      min_value: "1",
      max_value: "31"
    },
    {
      type: 4,
      name: "month",
      description: "The month to send the message",
      min_value: "1",
      max_value: "12"
    },
    {
      type: 4,
      name: "week",
      description: "The day of the week to send the message",
      min_value: "0",
      max_value: "6"
    },
  ],
  aliases: ["remind", "reminder"],
};

export { meta, command };
