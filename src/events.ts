import Eris, { AutocompleteInteraction, CommandInteraction, ComponentInteraction, Message, PingInteraction, PossiblyUncachedTextableChannel, UnknownInteraction } from "eris";
import fs from "fs";
import { Logger } from "./logger";
import Mongoose from "mongoose";
import DataFactory from "./datafactory/DataFactory";
import CronJob from "cron";

export default class Events {
  public client: Eris.Client;
  public logger: any;
  public commands: Map<string, Function>;
  public db: DataFactory;
  public crons: Map<string, CronJob.CronJob>;
  constructor(client: Eris.Client, logger: Logger, db: DataFactory) {
    this.client = client;
    this.logger = logger;
    this.commands = new Map();
    this.crons = new Map();
    this.db = db;
    this.getCommands();
    client.on("interactionCreate", (i) => {
      this.interactionCreate(i);
    });
    client.on("guildMemberAdd", (g, m) => {
      this.guildMemberAdd(g, m);
    });
    client.on("messageCreate", (m) => {
      this.messageCreate(m);
    });
    this.loadCrons();
  }

  startCron(channel: string, message: string, job: string, guildId: string) {
    let job2 = new CronJob.CronJob(job, () => {
      let channel2 = this.client.getChannel(channel);
      if (channel2 && channel2.type == 0) {
        channel2.createMessage({
          embed: {
            title: "Reminder",
            description: message,
            color: 0x00ff00,
          },
        });
      }
    });
    job2.start();
    this.crons.set(guildId, job2);
  }

  stopCron(guildId: string) {
    let job = this.crons.get(guildId);
    if (job) {
      job.stop();
    }
    this.crons.delete(guildId);
  }

  loadCrons() {
    this.db.models["Cron"].find().then((docs: any) => {
      docs.forEach((doc: any) => {
        this.logger.debug(`Loading cron job with channel id ${doc.get("channel")} and message ${doc.get("message")}`);
        this.startCron(doc.get("channel"), doc.get("message"), doc.get("cron"), doc.get("id"));
      });
    });
  }

  interactionCreate(interaction: PingInteraction | CommandInteraction | ComponentInteraction | AutocompleteInteraction | UnknownInteraction) {
    switch (interaction.type) {
      case 2: {
        let data: any = interaction.data;

        let command2 = this.commands.get(data.name);

        if (command2 && interaction.guildID != undefined) {
          command2.call(this, interaction, this.db, this);
        } else {
          interaction.createMessage({
            content: "Command not found!",
            flags: 1 << 6,
          });
        }
      }
    }
  }

  async messageCreate(message: Message<PossiblyUncachedTextableChannel>) {
    let member = message.member;
    let guildID = message.guildID;
    if (member && guildID && message.author.id != this.client.user.id) {
      let doc = await this.db.models["User"].findOne({ id: member.id });
      if (!doc) {
        console.log("Creating new user");
        this.db.models["User"].create({
          id: member.id,
          servers: [
            {
              serverId: guildID,
              messageCount: 1,
            },
          ],
        });
      } else {
        console.log("Incrementing message count")
        try {
        await this.db.models["User"].findOneAndUpdate({ id: member.id, "servers.serverId": guildID }, { $inc: { "servers.$.messageCount": 1 } }, { upsert: true });
        } catch (err) {
          //guild is not in the array, so make it
          await this.db.models["User"].findOneAndUpdate({ id: member.id }, { $push: { servers: { serverId: guildID, messageCount: 1 } } }, { upsert: true });
        }
      }
    }
  }

  async guildMemberAdd(guild: Eris.Guild, member: Eris.Member) {
    this.db.models["Server"]
      .findOne({ id: guild.id })
      .then((doc: Mongoose.Document) => {
        if (doc && doc.get("welcomeChannel")) {
          let channel = guild.channels.get(doc.get("welcomeChannel"));
          if (channel?.type == 0 && channel) {
            channel.createMessage({
              embed: {
                title: "Welcome!",
                description: `Welcome to ${guild.name}, ${member.mention}!`,
                color: 0x00ff00,
              },
            });
          }
        } else {
          this.db.models["Server"].create({
            id: guild.id,
            welcomeChannel: "",
          });
        }
      })
      .catch((err: any) => {
        this.logger.error(err);
      });
  }

  // Read the commands DIR and register all commands
  getCommands() {
    fs.readdirSync("./src/commands")
      .filter((file) => file.endsWith(".ts"))
      .forEach((dir) => {
        let command = require(`./commands/${dir.replace(".ts", ".js")}`);
        let meta = command.meta;
        if (meta) {
          this.client.createCommand(meta);
          this.commands.set(meta.name, command.command);
          this.logger.info(`Loaded command ${meta.name}`);
        }
      });
  }
}
