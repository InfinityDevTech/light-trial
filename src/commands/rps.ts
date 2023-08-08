import { CommandInteraction } from "eris";

function command(interaction: CommandInteraction) {
    let data: any = interaction.data;
    let choice = data.options[0].value;
    let botChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
    let name = ""
    let value = ""
    if (whoWon(botChoice, choice)) {
        name = "You won!"
        value = "I lost :("
    } else {
        name = "I won!"
        value = "You lost :("
    }
    interaction.createMessage({
        //@ts-ignore
        embeds: [{
            title: "Rock Paper Scissors",
                description: `You chose ${choice}, I chose ${botChoice}`,
                color: 0x00ff00,
                fields: [{
                    name: name,
                    value: value
                }]
        }]
    })
}

function whoWon(bot: string, player: string): Boolean {
    let option: Boolean = false;
    if (bot == "rock") {
        if (player == "scissors") {
            option = false;
        } else {
            option = true;
        }
    } else if (bot == "paper") {
        if (player == "rock") {
            option = false;
        } else {
            option = true;
        }
    } else if (bot == "scissors") {
        if (player == "paper") {
            option = false;
        } else {
            option = true;
        }
    }
    return option;
}

let meta = {
    name: "rps",
    description: "Play rock paper scissors with the bot",
    options: [{
        type: 3,
        name: "choice",
        description: "Your choice, rock, paper, or scissors",
        required: true,
        choices: [{name: "rock", value: "rock"}, {name: "paper", value: "paper"}, {name: "scissors", value: "scissors"}]
    }],
    aliases: ["rockpaperscissors", "rock-paper-scissors"]
}

export {meta, command};