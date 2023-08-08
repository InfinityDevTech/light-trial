import { CommandInteraction } from "eris";
import axios from "axios";
import config from "./../config";

function command(interaction: CommandInteraction) {
    let data: any = interaction.data;
    let stock = data.options[0].value;
    getStock(stock.toUpperCase()).then((stock) => {
        let meta = stock["Meta Data"];
        let lastRefreshed = meta["3. Last Refreshed"];
        let timeSeries = stock["Time Series (1min)"];
        let lastData = timeSeries[lastRefreshed];
        let open = lastData["1. open"];
        let symbol = meta["2. Symbol"];
        let TimeZone = meta["6. Time Zone"];
        interaction.createMessage({
            //@ts-ignore
            embeds: [{
                title: `Stock price for ${meta["2. Symbol"]}`,
                description: `Last refreshed at ${lastRefreshed}`,
                color: 0x00ff00,
                fields: [{
                    name: "Price",
                    value: open,
                    inline: true
                }, {
                    name: "Symbol",
                    value: symbol,
                    inline: true
                }, {
                    name: "Time Zone",
                    value: TimeZone,
                    inline: true
                }]
            }]
        })
    })
}

async function getStock(name: string) {
    let stock = await axios.get("https://www.alphavantage.co/query", {
        params: {
            function: "TIME_SERIES_INTRADAY",
            symbol: name,
            interval: "1min",
            apikey: config.alphaVantageKey,
        }
    })
    return stock.data;
}

let meta = {
    name: "stock",
    description: "Get information of a stock price",
    options: [{
        type: 3,
        name: "stock",
        description: "Name of a stock",
        required: true,
    }],
    aliases: ["stockprice", "stonk"]
}

export {meta, command};