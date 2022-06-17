//const Telegraf = require('telegraf');
const { Composer } = require('micro-bot')

//const TelegramBot = require('node-telegram-bot-api');
//const bodyParser = require('body-parser');
//"start": "nodemon bot.js"
require("dotenv").config();
//const packageInfo = require('./package.json');


const token = process.env.Token;
/*const options = {
    webHook: {
      // Port to which you should bind is assigned to $PORT variable
      // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
      port: process.env.PORT,
      // you do NOT need to set up certificates since Heroku provides
      // the SSL certs already (https://<app-name>.herokuapp.com)
      // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    },
  };
*/
//const bot = new Telegraf(token);
const bot = new Composer()


const axios = require('axios');
const fetch = require("node-fetch");
const RestAPIurl = "https://script.google.com/macros/s/AKfycbxXf4a4dqiT9mAZz4JJCT-soTeHFjowWwWeY9nrEeukLMvgq7FA/exec"

/*
//Webhook section
const express = require("express")
const bodyParser = require('body-parser');
//get app inside express
const app = express()
const CURRENT_URL = process.env.HEROKU_URL;

let PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Listen in the port ${PORT}`)
    })

//this unite Express with webHook from Telegraf
//app.use(bot.webhookCallback(`/bot${token}`));
app.use(bot.webhookCallback(`/bot`));
//and this will set our webhook for our bot
//bot.telegram.setWebhook(`${CURRENT_URL}/bot${token}`);
bot.telegram.setWebhook(`${CURRENT_URL}/bot`);

//before app.get
app.get("/", (req, res) => {
  res.send("Our new tab!!");
  console.log(req);
});

app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

//End of Webhook sectiton
*/

const answer = `
=====*Welcome to SDP-Mapping Bot*=====
_Search_ - To search for a place by name or number.
_Choose Floor_ - Choose from the floors listed.
/start - To start the bot
/help - Shows lists of commands used in the bot
`;

const type = `
=====*Type of Place*=====
*Office* - 
*Payment* -
*Room* - 
*Laboratory* - 
*Pharmacy* - 
*Ward* - 
`


//work on this function to use data[0].data 
function fetchJSON(){
fetch(RestAPIurl)
    .then(d => d.json())
    .then(d => {
        return d[0].data;
    })
}


bot.help((ctx) => {
    ctx.reply(answer);
})

bot.start((ctx) => {
    var id = ctx.chat.id; 
    ctx.telegram.sendMessage(id, answer , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Search", switch_inline_query_current_chat: ""}],
                [{text: "Choose Floor", callback_data: "Floor list"}]
            ]
        }
    });

})

bot.on('inline_query', ctx => {
    var query = ctx.inlineQuery.query;  
    //var id = ctx.chat.id; 
    fetch(RestAPIurl)
        .then(d => d.json())
        .then(d => {
            var result = d[0].data;
            var filtered = result.filter(item => item.Place.toString().toLowerCase().includes(query) == true);

            var results = filtered.map((elem, index) => (
                {
                type:'article', 
                id: String(index),
                title: elem.Place, 
                description: elem.Floor,
                message_text:   "Place: " + String(elem.Place) + "\n" + 
                                "Type: " + String(elem.Type) + "\n" + 
                                "Worktime: " + String(elem.Worktime) + "\n" + 
                                "Floor: " + String(elem.Floor) + "\n" + 
                                "Map: " + String(elem.MAP) + "\n" + 
                                "Direction: " + String(elem.Direction) + "\n" +
                                "ProcedureDone:" + String(elem.Procedure) + "\n"  
                })
            );

            if (results.length > 20){
                results.length = 15
            }
           
            console.log(results);
            ctx.answerInlineQuery(results, {cache_time: 300});
            
        })

    console.log(query);
})

bot.action('Floor list', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, "Choose from the floors listed below." , {
        reply_markup: {
            inline_keyboard: [
                [{text: "Ground Floor", callback_data: "Ground floor"}],
                [{text: "Floor 1", callback_data: "1st floor"},{text: "Floor 2", callback_data: "2nd floor"},{text: "Floor 3", callback_data: "3rd floor"} ],
                [{text: "Floor 4", callback_data: "4th floor" },{text: "Floor 5", callback_data: "5th floor"},{text: "Floor 6", callback_data: "6th floor"}],
                [{text: "Floor 7", callback_data: "7th floor"},{text: "Floor 8", callback_data: "8th floor"}],
                [{text: "Back to MainMenu", callback_data: "Main"}]
            ]
        }
    });

})


bot.action('Main', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, answer , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Search", switch_inline_query_current_chat: ''}],
                [{text: "Choose Floor", callback_data: "Floor list"}]
            ]
        }
    });
})

// First Floor results based on place choosen
// Add student lab
bot.action('1st floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office"}, {text: "Payment", callback_data: "Payment"}, {text: "Room", callback_data: "Room"} ],
                [{text: "Laboratory", callback_data: "Laboratory"}, {text: "Pharmacy", callback_data: "Pharmacy"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office', 'Payment', 'Laboratory', 'Pharmacy', 'Room'], (ctx) => {
    var id = ctx.chat.id; 
    choice = ctx.match
    console.log(choice)
    floor = "1st floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
            `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}
                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 1st Floor." + "\n" + 
                                     NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//Second floor results based on place choosen
bot.action('2nd floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office2"}, {text: "Payment", callback_data: "Payment2"}, {text: "Room", callback_data: "Room2"}],
                [{text: "Laboratory", callback_data: "Laboratory2"}, {text: "Pharmacy", callback_data: "Pharmacy2"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office2', 'Payment2', 'Laboratory2', 'Pharmacy2', 'Room2'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office2'){
        choice = 'Office'
    }else if(ctx.match == 'Payment2'){
        choice = 'Payment'
    }else if(ctx.match == 'Laboratory2'){
        choice = 'Laboratory'
    }else if(ctx.match == 'Pharmacy2'){
        choice = 'Pharmacy'
    }else{
        choice = 'Room'
    }

    console.log(choice)
    floor = "2nd floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
             `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 2nd Floor." + "\n" + 
                                     NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//Third floor results based on place choosen
bot.action('3rd floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office3"}, {text: "Payment", callback_data: "Payment3"}, {text: "Room", callback_data: "Room3"}],
                [{text: "Laboratory", callback_data: "Laboratory3"}, {text: "Pharmacy", callback_data: "Pharmacy3"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office3', 'Payment3', 'Laboratory3', 'Pharmacy3', 'Room3'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office3'){
        choice = 'Office'
    }else if(ctx.match == 'Payment3'){
        choice = 'Payment'
    }else if(ctx.match == 'Laboratory3'){
        choice = 'Laboratory'
    }else if(ctx.match == 'Pharmacy3'){
        choice = 'Pharmacy'
    }else{
        choice = 'Room'
    }

    console.log(choice)
    floor = "3rd floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
            `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 3rd Floor." + "\n" + 
                                    NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//Fourth floor results based on place choosen
bot.action('4th floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office4"}, {text: "Ward", callback_data: "ward4"}],
                [{text: "Room", callback_data: "Room4"}, {text: "Pharmacy", callback_data: "Pharmacy4"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office4', 'ward4', 'Pharmacy4', 'Room4'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office4'){
        choice = 'Office'
    }else if(ctx.match == 'ward4'){
        choice = 'ward'
    }else if(ctx.match == 'Pharmacy4'){
        choice = 'Pharmacy'
    }else{
        choice = 'Room'
    }

    console.log(choice)
    floor = "4th floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
             `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 4th Floor." + "\n" + 
                                    NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//Fifth floor results based on place choosen
bot.action('5th floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office5"}, {text: "Ward", callback_data: "ward5"},
                {text: "Room", callback_data: "Room5"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office5', 'ward5', 'Room5'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office5'){
        choice = 'Office'
    }else if(ctx.match == 'ward5'){
        choice = 'ward'
    }else{
        choice = 'Room'
    }
    //choice = ctx.match
    console.log(choice)
    floor = "5th floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
              `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 5th Floor." + "\n" + 
                                    NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//6th Floor results based on place choosen
bot.action('6th floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office6"}, {text: "Ward", callback_data: "ward6"},
                {text: "Room", callback_data: "Room6"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office6', 'ward6', 'Room6'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office6'){
        choice = 'Office'
    }else if(ctx.match == 'ward6'){
        choice = 'ward'
    }else{
        choice = 'Room'
    }
    //choice = ctx.match
    console.log(choice)
    floor = "6th floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
            `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 6th Floor." + "\n" + 
                                    NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//7th Floor results based on the place choosen
bot.action('7th floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office7"}, {text: "Ward", callback_data: "ward7"},
                {text: "Room", callback_data: "Room7"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office7', 'ward7', 'Room7'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office7'){
        choice = 'Office'
    }else if(ctx.match == 'ward7'){
        choice = 'ward'
    }else{
        choice = 'Room'
    }
    //choice = ctx.match
    console.log(choice)
    floor = "7th floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
                    `
    Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }
        ctx.telegram.sendMessage(id, "List of " + choice +  " on 7th Floor." + "\n" + 
                                    NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//8th Floor results based on the place choosen
bot.action('8th floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "Office8"}, {text: "Ward", callback_data: "ward8"},
                {text: "Room", callback_data: "Room8"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['Office8', 'ward8', 'Room8'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'Office8'){
        choice = 'Office'
    }else if(ctx.match == 'ward8'){
        choice = 'ward'
    }else{
        choice = 'Room'
    }
    //choice = ctx.match
    console.log(choice)
    floor = "8th floor"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
            `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on 8th Floor." + "\n" + 
                                    NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


//Ground floor Results Based on place Choosen
bot.action('Ground floor', (ctx) => {
    var id = ctx.chat.id; 
    ctx.deleteMessage()
    ctx.telegram.sendMessage(id, type , {
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: "Office", callback_data: "OfficeG"}, {text: "Lecture Hall", callback_data: "Hall"},
                {text: "Room", callback_data: "RoomG"}],
                [{text: "Back to MainMenu", callback_data: "Main"}],
                [{text: "Back to Floor List", callback_data: "Floor list"}]
            ]
        }
    });
})

bot.action(['OfficeG', 'Hall', 'RoomG'], (ctx) => {
    var id = ctx.chat.id; 

    if(ctx.match == 'OfficeG'){
        choice = 'Office'
    }else if(ctx.match == 'Hall'){
        choice = 'Hall'
    }else{
        choice = 'Room'
    }
    //choice = ctx.match
    console.log(choice)
    floor = "Ground"

    ctx.deleteMessage()
    

    Placetype(choice, floor)
    .then((result) =>{
        var NumOfResults = result.length

        var description = result.map((elem, index) => (
            `
        Result ${index + 1}
*${elem.Place}*
_Worktime:_ ${elem.Worktime}
_Direction:_ ${elem.Direction}
_Procedure Done:_ ${elem.Procedure}
_Map:_ ${elem.MAP}

                `
        ));

        if(description.length > 20){
            description.length = 9;
            ctx.reply("More than 20 results found. Only some results are displayed.")
        }else if(description.length > 10){
            description.length = 5;
            ctx.reply("Only some results are displayed")
        }

        ctx.telegram.sendMessage(id, "List of " + choice +  " on Ground Floor." + "\n" + 
                                   NumOfResults + " results" + "\n"  + "\n" + description, {
            parse_mode: "markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: "Back to MainMenu", callback_data: "Main"}],
                    [{text: "Back to Floor List", callback_data: "Floor list"}]
                ]
            }
        });

    })
})


async function Placetype(choice, floor){
    let res = await axios.get(RestAPIurl)
        result = res.data[0].data;

        place = result.filter((elem) => {return elem.Type.toString().includes(choice) == true});
       
        description = place.map((elem) => (
            {
            Description:   "Place: " + String(elem.Place) + "\n" + 
                            "Floor: " + String(elem.Floor) + "\n" + 
                            "Direction: " + String(elem.Direction) + "\n" 
            })
        );

        placefloor = place.filter((elem) => {return elem.Floor.toString().includes(floor) == true })
        
        return placefloor;
}


//bot.startWebhook('/bot', null, 5000)
//bot.launch();
/*
bot.launch({
    webhook: {
      domain: 'https://polar-oasis-61648.herokuapp.com/',
      port: process.env.PORT,
      hookPath: https://polar-oasis-61648.herokuapp.com/5132220675:AAH5IB9njzIw70LeKoSM-229kNMhYQOHQzo
      tlsOptions: null,
    }
  })
*/
module.exports = bot
