const  Telegraf = require('telegraf')

require("dotenv").config();


const token = process.env.Token;
const RestAPIurl = process.env.APIurl;

const bot = new Telegraf(token);
const axios = require('axios');
const fetch = require("node-fetch");

/*
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!! This is Mapping Bot Server');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
*/

const answer = `
          🗺️<b> Welcome to GuidedMed Bot</b> 🗺️

🔎 <b>Search</b> 
      Type the name or number of the place you want

🏢 <b>Choose Floor</b>
      Choose floor to see the available places 

🗣️ <b>Change Language</b>
      Switch between English and Amharic

✅ <b>Feedback</b>
      If you have any comments or request...

☰ <b>Menu</b> 
      See list of commands used in the bot

/start - To start the bot

❗⚠️📢Disclaimer: Please note that some of the locations may not be accurate due to the ongoing renovation of the hospital. But we have a dedicated team at the backend working on it constantly. 
🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹
`;

const answerAmh = `
🗺️<b><u> ወደ GuidedMed Bot እንኳን ደህና መጡ!!</u></b>🗺️

🔎 <b>ፈልግ</b> 
      የሚፈልጉትን ቦታ ስም ወይም ቁጥር በማስገባት ለመፈለግ

🏢 <b>ወለል ምረጥ</b>
      ከተዘረዘሩት ፎቆች ከመረጡ በኋላ በፎቁ ላይ የሚገኙትን ቦታዎች ለማየት 

🗣️ <b>ቋንቋ ቀይር</b>
      ከአማርኛ ወደ እንግሊዘኛ ወይም ከእንግሊዘኛ ወደ አማርኛ ቋንቋ ለመቀየር

✅ <b>አስተያየት</b>
      አስተያየት ፣ ጥያቄ... ለመላክ

☰ <b>Menu</b>
      ያሉትን ትዕዛዞች ለማየት

/start - ቦቱን ለማስጀመር 

❗⚠️📢ማሳሰቢያ፡ አንዳንድ ቦታዎች በሆስፒታሉ እድሳት ምክንያት ትክክል ላይሆኑ ይችላሉ። ነገር ግን ያለማቋረጥ ከበስተጀርባው የሚሠራ ቡድን ስላለን ስህተት ካገኙ ወይም ሃሳብ እና አስተያየት ካሎት ይላኩልን።
🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹
`

const type = `
🔹🔹🔹🔹🔹<b>Places</b>🔹🔹🔹🔹🔹

🗃️ <b>Office</b>           🔬 <b>Laboratory</b>
💵 <b>Payment</b>       💊 <b>Pharmacy</b> 
🏢 <b>Rooms</b>          🏥 <b>Ward</b> 
`

const typeAmh = `
🔹🔹🔹🔹🔹<b>ቦታዎች</b>🔹🔹🔹🔹🔹

🗃️ <b>ቢሮ</b>              🔬 <b>ላብራቶሪ</b>
💵 <b>የክፍያ ቦታ</b>       💊 <b>ፋርማሲ</b> 
🏢 <b>ክፍሎች</b>           🏥 <b>ዋርድ</b> 

`

//Fetch data from API + work on this function to use data[0].data 
async function fetchJSON() {
  try {
    const response = await axios.get(RestAPIurl);
    return response.data[0];
  } catch (error) {
    console.log(error);
  }
}


// Filter result by floor and type
async function Placetype(choice, floor) {
  try {
    // ... existing code ...
    const data = await fetchJSON();
    const result = data.dataEng;

    const filteredData = result.filter(elem => {
      return elem.Type.toString().includes(choice) && elem.Floor.toString().includes(floor);
    });

    const description = filteredData.map((elem, index) => ({
      Description: `\n
        <u><b>📌 ${String(elem.Place)} 📌</b></u>
    🗓️ <b>Worktime:</b> ${String(elem.Worktime)}
    🧭 <b>Direction:</b> ${String(elem.Direction)}
    💉 <b>Procedure Done:</b> ${String(elem.Procedure)}
    🗺️ <b>Map:</b>\n${String(elem.MAP)}\n`
    }));
    return description;
  } catch (error) {
    //console.error('Error in Placetype:', error);
    // Handle the error
    //throw error;
    console.log(error);
  }
}

//Amharic version for Placetype
async function AmhPlacetype(choice, floor,) {
  try {
    // ... existing code ...
    const data = await fetchJSON();
    const result = data.dataAmh;

    const filteredData = result.filter(elem => {
      return elem.Type.toString().includes(choice) && elem.Floor.toString().includes(floor);
    });

    const description = filteredData.map((elem, index) => ({
      Description: `\n
          <u><b>📌 ${String(elem.Place)} 📌</b></u>
    🗓️ <b>የስራ ጊዜ: </b> ${String(elem.Worktime)}
    🧭 <b>አቅጣጫ: </b> ${String(elem.Direction)}
    💉 <b>የሚከናወኑ_ተግባራት: </b> ${String(elem.Procedure)}
    🗺️ <b>ካርታ: </b>\n${String(elem.MAP)}\n`
    }));
    return description;
  } catch (error) {
    //console.error('Error in Placetype:', error);
    // Handle the error
    //throw error;
    console.log(error);
  }
}


// Global error handler
bot.catch(async (err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  console.error('Error caught:', err);

  // Check if the error is related to the bot being blocked by the user
  if (err.response && err.response.ok === false && err.response.error_code === 403 && err.response.description.includes('Forbidden: bot was blocked by the user')) {
    const blockedUserId = ctx.from.id || 257256043;

    // Log the blocked user's ID to the console
    console.error(`User has blocked the bot: ${blockedUserId}`);

    // You can also store the blocked user's ID in a log file
    // Example: fs.appendFileSync('blocked_users.log', `${blockedUserId}\n`, 'utf8');

    // Send a notification to the bot owner
    /*
    try {
      // Attempt to send a message to the blocked user
      await bot.telegram.sendMessage(blockedUserId, "This bot has been blocked. Please contact the bot owner to fix the issue.");
    } catch (sendMessageError) {
      console.error('Error sending message to blocked user:', sendMessageError);
    }*/

    // Don't throw the error to prevent crashing the bot
    return;
  }

  // If it's not the specific error you're handling, you can throw it or handle it accordingly
  //throw err;
  console.log(err);
});

bot.start((ctx) => {
  //console.log(ctx);
  //console.log(ctx.chat)
  var id = ctx.chat.id;

  ctx.telegram.sendMessage(id, "Choose Language", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "English", callback_data: "Main" }, { text: "Amharic", callback_data: "Amharic" }]
      ]
    }
  });

})


//Use replyKeyboard instead => clean & less errors
bot.action('Floor list', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, "Choose from the floors listed below.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Ground Floor", callback_data: "Ground floor" }],
        [{ text: "Floor 1", callback_data: "1st floor" }, { text: "Floor 2", callback_data: "2nd floor" }, { text: "Floor 3", callback_data: "3rd floor" }],
        [{ text: "Floor 4", callback_data: "4th floor" }, { text: "Floor 5", callback_data: "5th floor" }, { text: "Floor 6", callback_data: "6th floor" }],
        [{ text: "Floor 7", callback_data: "7th floor" }, { text: "Floor 8", callback_data: "8th floor" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})


bot.action('Language', async (ctx) => {
  var id = ctx.chat.id;

  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, "Choose Language", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "English", callback_data: "Main" }, { text: "Amharic", callback_data: "Amharic" }]
      ]
    }
  });
})



bot.action('Main', async (ctx) => {
  var id = ctx.chat.id;
  //console.log(ctx.state.lang)
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, answer, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Search", switch_inline_query_current_chat: "" }, { text: "Choose Floor", callback_data: "Floor list" }],
        [{ text: "Change Language", callback_data: "Language" }],
        [{ text: "Feedback", web_app: { url: "https://script.google.com/macros/s/AKfycbwLCYV5X2OxOkvnz4gyrEqnUwiBKB-j5ZYYgm13nPBCypFuAk4o6YtPEUv0rjDkDIaGwg/exec" } }]
      ]
    }
  });

})

bot.on('inline_query', async ctx => {
  var query = ctx.inlineQuery.query;
  console.log(ctx.update);

  //Call fetchJSON function
  const data = await fetchJSON();
  const result = data.dataEng;

  var filtered = result.filter(item => item.Place.toString().toLowerCase().includes(query.toLowerCase()) || item.Procedure.toString().toLowerCase().includes(query.toLowerCase()) === true);

  //Call mapResult function instead
  let results = filtered.map((elem, index) => (
    {
      type: 'article',
      id: String(index),
      title: elem.Place,
      description: elem.Floor,
      parse_mode: "HTML",
      message_text: `
                📌 <b>${elem.Place}</b> on ${elem.Floor} 📌

🗓️ <b>Worktime</b>
    ${elem.Worktime}

🧭 <b>Direction</b>
    ${elem.Direction}

💉 <b>Procedure</b>
    ${elem.Procedure}

🗺️ <b>Map</b>
    ${elem.MAP}
                        `
    })
  );

  if (results.length === 0) {
    results.push({
      type: 'article',
      id: 'no_results',
      title: 'No results found',
      description: 'Your search did not match any results. Please  rewrite the name or number of the location. Or send us a feedback- so that we could add the location.',
      input_message_content: {
        message_text: 'No results found for your search.',
      },
    });
  }


  const MAX_RESULTS = 20;
  if (results.length > MAX_RESULTS) {
    results = results.slice(0, MAX_RESULTS);
  }
  ctx.answerInlineQuery(results, { cache_time: 300 });

})


// First Floor
// Add student lab
bot.action('1st floor', async (ctx) => {
  var id = ctx.chat.id;
  console.log(ctx.state.lang)

  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office" }, { text: "Payment", callback_data: "Payment" }, { text: "Room", callback_data: "Room" }],
        [{ text: "Laboratory", callback_data: "Laboratory" }, { text: "Pharmacy", callback_data: "Pharmacy" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

// Declare totalPages and handlePaginationAction variables in a higher scope
let totalPages;
let handlePaginationAction;

// Function to generate the message for the current page
const generatePageMessage = (results, page, choice, floor) => {
  const pageSize = 5; // Number of results to display per page
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pageResults = results.slice(startIdx, endIdx);

  const description = pageResults.map((elem, index) => elem.Description);
  const resultMessage = `List of ${choice} on ${floor}.\nPage ${page}/${totalPages}\n${description.join('\n')}`;

  return resultMessage;
};

// Function to generate the inline keyboard for pagination
const generatePaginationKeyboard = (page) => {
  const keyboard = [
    [{ text: "Back to MainMenu", callback_data: "Main" }],
    [{ text: "Back to Floor List", callback_data: "Floor list" }]
  ];

  if (totalPages > 1) {
    const paginationRow = [];

    if (page > 1) {
      paginationRow.push({ text: "◀️ Previous", callback_data: `Page:${page - 1}` });
    }
    if (page < totalPages) {
      paginationRow.push({ text: "Next ▶️", callback_data: `Page:${page + 1}` });
    }

    if (paginationRow.length > 0) {
      keyboard.unshift(paginationRow);
    }
  }


  return { inline_keyboard: keyboard };
};


bot.action(['Office', 'Payment', 'Laboratory', 'Pharmacy', 'Room'], async (ctx) => {
  const id = ctx.chat.id;
  console.log(ctx.match);
  const choice = ctx.match;
  const floor = "1st floor";

  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  }

  Placetype(choice, floor)
    .then((results) => {
      //console.log(results);
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
});

// Pagination action handler
bot.action(/Page:(\d+)/, async (ctx) => {
  const page = parseInt(ctx.match[1]);
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  }

  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    handlePaginationAction(currentPage);
  }
});

//Second floor results based on place choosen
bot.action('2nd floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office2" }, { text: "Payment", callback_data: "Payment2" }, { text: "Room", callback_data: "Room2" }],
        [{ text: "Laboratory", callback_data: "Laboratory2" }, { text: "Pharmacy", callback_data: "Pharmacy2" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office2', 'Payment2', 'Laboratory2', 'Pharmacy2', 'Room2'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office2') {
    choice = 'Office'
  } else if (ctx.match == 'Payment2') {
    choice = 'Payment'
  } else if (ctx.match == 'Laboratory2') {
    choice = 'Laboratory'
  } else if (ctx.match == 'Pharmacy2') {
    choice = 'Pharmacy'
  } else {
    choice = 'Room'
  }

  console.log(choice)
  floor = "2nd floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//Third floor results based on place choosen
bot.action('3rd floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office3" }, { text: "Payment", callback_data: "Payment3" }, { text: "Room", callback_data: "Room3" }],
        [{ text: "Laboratory", callback_data: "Laboratory3" }, { text: "Pharmacy", callback_data: "Pharmacy3" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office3', 'Payment3', 'Laboratory3', 'Pharmacy3', 'Room3'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office3') {
    choice = 'Office'
  } else if (ctx.match == 'Payment3') {
    choice = 'Payment'
  } else if (ctx.match == 'Laboratory3') {
    choice = 'Laboratory'
  } else if (ctx.match == 'Pharmacy3') {
    choice = 'Pharmacy'
  } else {
    choice = 'Room'
  }

  console.log(choice)
  floor = "3rd floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//Fourth floor results based on place choosen
bot.action('4th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office4" }, { text: "Ward", callback_data: "ward4" }],
        [{ text: "Room", callback_data: "Room4" }, { text: "Pharmacy", callback_data: "Pharmacy4" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office4', 'ward4', 'Pharmacy4', 'Room4'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office4') {
    choice = 'Office'
  } else if (ctx.match == 'ward4') {
    choice = 'ward'
  } else if (ctx.match == 'Pharmacy4') {
    choice = 'Pharmacy'
  } else {
    choice = 'Room'
  }

  console.log(choice)
  floor = "4th floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//Fifth floor results based on place choosen
bot.action('5th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office5" }, { text: "Ward", callback_data: "ward5" },
        { text: "Room", callback_data: "Room5" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office5', 'ward5', 'Room5'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office5') {
    choice = 'Office'
  } else if (ctx.match == 'ward5') {
    choice = 'ward'
  } else {
    choice = 'Room'
  }
  //choice = ctx.match
  console.log(choice)
  floor = "5th floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//6th Floor results based on place choosen
bot.action('6th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office6" }, { text: "Ward", callback_data: "ward6" },
        { text: "Room", callback_data: "Room6" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office6', 'ward6', 'Room6'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office6') {
    choice = 'Office'
  } else if (ctx.match == 'ward6') {
    choice = 'ward'
  } else {
    choice = 'Room'
  }
  //choice = ctx.match
  console.log(choice)
  floor = "6th floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//7th Floor results based on the place choosen
bot.action('7th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office7" }, { text: "Ward", callback_data: "ward7" },
        { text: "Room", callback_data: "Room7" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office7', 'ward7', 'Room7'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office7') {
    choice = 'Office'
  } else if (ctx.match == 'ward7') {
    choice = 'ward'
  } else {
    choice = 'Room'
  }
  //choice = ctx.match
  console.log(choice)
  floor = "7th floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//8th Floor results based on the place choosen
bot.action('8th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "Office8" }, { text: "Ward", callback_data: "ward8" },
        { text: "Room", callback_data: "Room8" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['Office8', 'ward8', 'Room8'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Office8') {
    choice = 'Office'
  } else if (ctx.match == 'ward8') {
    choice = 'ward'
  } else {
    choice = 'Room'
  }
  //choice = ctx.match
  console.log(choice)
  floor = "8th floor"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})


//Ground floor Results Based on place Choosen
bot.action('Ground floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, type, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Office", callback_data: "OfficeG" }, { text: "Lecture Hall", callback_data: "Hall" },
        { text: "Room", callback_data: "RoomG" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }],
        [{ text: "Back to Floor List", callback_data: "Floor list" }]
      ]
    }
  });
})

bot.action(['OfficeG', 'Hall', 'RoomG'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'OfficeG') {
    choice = 'Office'
  } else if (ctx.match == 'Hall') {
    choice = 'Hall'
  } else {
    choice = 'Room'
  }
  //choice = ctx.match
  console.log(choice)
  floor = "Ground"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };


  Placetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generatePageMessage(results, page, choice, floor);
        const keyboardMarkup = generatePaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "No results found.", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Back to MainMenu", callback_data: "Main" }],
                [{ text: "Back to Floor List", callback_data: "Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);
    });
})



// Amharic Version
bot.action('Amharic', async (ctx) => {
  var id = ctx.chat.id;

  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, answerAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ፈልግ", switch_inline_query_current_chat: "" }, { text: "ወለል ምረጥ", callback_data: "Amh: Floor list" }],
        [{ text: "ቋንቋ ቀይር", callback_data: "Language" }],
        [{ text: "አስተያየት", web_app: { url: "https://script.google.com/macros/s/AKfycbwLCYV5X2OxOkvnz4gyrEqnUwiBKB-j5ZYYgm13nPBCypFuAk4o6YtPEUv0rjDkDIaGwg/exec" } }]
      ]
    }
  });

})

bot.action('Amh: Floor list', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
  };

  ctx.telegram.sendMessage(id, "የሚፈልጉትን ፎቅ ይምረጡ፡፡", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "መሬት", callback_data: "Amh: Ground floor" }],
        [{ text: "1ኛ ፎቅ", callback_data: "Amh: 1st floor" }, { text: "2ኛ ፎቅ", callback_data: "Amh: 2nd floor" }, { text: "3ኛ ፎቅ", callback_data: "Amh: 3rd floor" }],
        [{ text: "4ኛ ፎቅ", callback_data: "Amh: 4th floor" }, { text: "5ኛ ፎቅ", callback_data: "Amh: 5th floor" }, { text: "6ኛ ፎቅ", callback_data: "Amh: 6th floor" }],
        [{ text: "7ኛ ፎቅ", callback_data: "Amh: 7th floor" }, { text: "8ኛ ፎቅ", callback_data: "Amh: 8th floor" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }]
      ]
    }
  });

})

// Function to generate Amharic message for the current page
const generateAmharicPageMessage = (results, page, choice, floor) => {
  const pageSize = 5; // Number of results to display per page
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pageResults = results.slice(startIdx, endIdx);

  const description = pageResults.map((elem, index) => elem.Description);
  const resultMessage = `<b>በ${floor}</b> ላይ የሚገኙ <b>የ${choice}</b> ዝርዝር \nገጽ ${page}/${totalPages}\n${description.join('\n')}`;

  return resultMessage;
};

// Function to generate Amharic inline keyboard for pagination
const generateAmharicPaginationKeyboard = (page) => {
  const keyboard = [
    [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
    [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
  ];

  if (totalPages > 1) {
    const paginationRow = [];

    if (page > 1) {
      paginationRow.push({ text: "◀️ የቀድሞ ገጽ", callback_data: `Page:${page - 1}` });
    }
    if (page < totalPages) {
      paginationRow.push({ text: "ቀጣይ ገጽ ▶️", callback_data: `Page:${page + 1}` });
    }

    if (paginationRow.length > 0) {
      keyboard.unshift(paginationRow);
    }
  }


  return { inline_keyboard: keyboard };
};

//Ground floor Results Based on place Choosen
bot.action('Amh: Ground floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: OfficeG" }, { text: "አዳራሽ", callback_data: "Amh: Hall" },
        { text: "ክፍል", callback_data: "Amh: RoomG" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: OfficeG', 'Amh: Hall', 'Amh: RoomG'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: OfficeG') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: Hall') {
    choice = 'አዳራሽ'
  } else {
    choice = 'ክፍል'
  }
  //choice = ctx.match
  console.log(choice)
  floor = "መሬት"
  //bot.telegram.sendChatAction(id, "typing");
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };


  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})

// First Floor results based on place choosen
// Add student lab
bot.action('Amh: 1st floor', async (ctx) => {
  var id = ctx.chat.id;

  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office" }, { text: "ክፍያ", callback_data: "Amh: Payment" }, { text: "ክፍል", callback_data: "Amh: Room" }],
        [{ text: "ላብራቶሪ", callback_data: "Amh: Laboratory" }, { text: "ፋርማሲ", callback_data: "Amh: Pharmacy" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office', 'Amh: Payment', 'Amh: Laboratory', 'Amh: Pharmacy', 'Amh: Room'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: Payment') {
    choice = 'ክፍያ'
  } else if (ctx.match == 'Amh: Laboratory') {
    choice = 'ላብራቶሪ'
  } else if (ctx.match == 'Amh: Pharmacy') {
    choice = 'ፋርማሲ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "1 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };


  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})

//Second floor results based on place choosen
bot.action('Amh: 2nd floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office2" }, { text: "ክፍያ", callback_data: "Amh: Payment2" }, { text: "ክፍል", callback_data: "Amh: Room2" }],
        [{ text: "ላብራቶሪ", callback_data: "Amh: Laboratory2" }, { text: "ፋርማሲ", callback_data: "Amh: Pharmacy2" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office2', 'Amh: Payment2', 'Amh: Laboratory2', 'Amh: Pharmacy2', 'Amh: Room2'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office2') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: Payment2') {
    choice = 'ክፍያ'
  } else if (ctx.match == 'Amh: Laboratory2') {
    choice = 'ላብራቶሪ'
  } else if (ctx.match == 'Amh: Pharmacy2') {
    choice = 'ፋርማሲ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "2 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})


//Third floor results based on place choosen
bot.action('Amh: 3rd floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office3" }, { text: "ክፍያ", callback_data: "Amh: Payment3" }, { text: "ክፍል", callback_data: "Amh: Room3" }],
        [{ text: "ላብራቶሪ", callback_data: "Amh: Laboratory3" }, { text: "ፋርማሲ", callback_data: "Amh: Pharmacy3" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office3', 'Amh: Payment3', 'Amh: Laboratory3', 'Amh: Pharmacy3', 'Amh: Room3'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office3') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: Payment3') {
    choice = 'ክፍያ'
  } else if (ctx.match == 'Amh: Laboratory3') {
    choice = 'ላብራቶሪ'
  } else if (ctx.match == 'Amh: Pharmacy3') {
    choice = 'ፋርማሲ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "3 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})

//Fourth floor results based on place choosen
bot.action('Amh: 4th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office4" }, { text: "ዋርድ", callback_data: "Amh: ward4" }],
        [{ text: "ክፍል", callback_data: "Amh: Room4" }, { text: "ፋርማሲ", callback_data: "Amh: Pharmacy4" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office4', 'Amh: ward4', 'Amh: Pharmacy4', 'Amh: Room4'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office4') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: ward4') {
    choice = 'ዋርድ'
  } else if (ctx.match == 'Amh: Pharmacy4') {
    choice = 'ፋርማሲ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "4 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})


//Fifth floor results based on place choosen
bot.action('Amh: 5th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office5" }, { text: "ዋርድ", callback_data: "Amh: ward5" },
        { text: "ክፍል", callback_data: "Amh: Room5" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office5', 'Amh: ward5', 'Amh: Room5'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office5') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: ward5') {
    choice = 'ዋርድ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "5 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})

//6th Floor results based on place choosen
bot.action('Amh: 6th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office6" }, { text: "ዋርድ", callback_data: "Amh: ward6" },
        { text: "ክፍል", callback_data: "Amh: Room6" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office6', 'Amh: ward6', 'Amh: Room6'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office6') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: ward6') {
    choice = 'ዋርድ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "6 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})


//7th Floor results based on the place choosen
bot.action('Amh: 7th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office7" }, { text: "ዋርድ", callback_data: "Amh: ward7" },
        { text: "ክፍል", callback_data: "Amh: Room7" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office7', 'Amh: ward7', 'Amh: Room7'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office7') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: ward7') {
    choice = 'ዋርድ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "7 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})


//8th Floor results based on the place choosen
bot.action('Amh: 8th floor', async (ctx) => {
  var id = ctx.chat.id;
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  ctx.telegram.sendMessage(id, typeAmh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ቢሮ", callback_data: "Amh: Office8" }, { text: "ዋርድ", callback_data: "Amh: ward8" },
        { text: "ክፍል", callback_data: "Amh: Room8" }],
        [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
        [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
      ]
    }
  });
})

bot.action(['Amh: Office8', 'Amh: ward8', 'Amh: Room8'], async (ctx) => {
  var id = ctx.chat.id;

  if (ctx.match == 'Amh: Office8') {
    choice = 'ቢሮ'
  } else if (ctx.match == 'Amh: ward8') {
    choice = 'ዋርድ'
  } else {
    choice = 'ክፍል'
  }

  console.log(choice)
  floor = "8 ኛ ፎቅ"
  try {
    await ctx.deleteMessage()
  } catch (error) {
    console.log(error);
    //ctx.reply("ይቅርታ ለተፈጠረው ችግር ቦቱን ከእንደገና ያስጀምሩ - /start");
  };

  AmhPlacetype(choice, floor)
    .then((results) => {
      const numOfResults = results.length;
      totalPages = Math.ceil(numOfResults / 5); // Set the totalPages value
      let currentPage = 1;

      // Function to handle pagination actions
      handlePaginationAction = async (page) => {
        const message = generateAmharicPageMessage(results, page, choice, floor);
        const keyboardMarkup = generateAmharicPaginationKeyboard(page);

        try {
          await ctx.deleteMessage();
        } catch (error) {
          console.log(error);
          //ctx.reply("Sorry, the message could not be deleted. Please restart the bot - /start");
        }

        if (numOfResults === 0) {
          ctx.telegram.sendMessage(id, "ምንም ውጤት አልተገኘም!", {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "ወደ ዋና ማውጫ", callback_data: "Amharic" }],
                [{ text: "ወደ የፎቅ ዝርዝር", callback_data: "Amh: Floor list" }]
              ]
            }
          });
        } else {
          await ctx.telegram.sendMessage(id, message, {
            parse_mode: "HTML",
            reply_markup: keyboardMarkup
          });
        }
      };

      // Initial page message and keyboard
      handlePaginationAction(currentPage);

    })
})

bot.launch();
//module.exports = bot