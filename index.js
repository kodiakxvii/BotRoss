const Discord = require('discord.js');
const {prefix, token, giphyToken, quotes } = require('./config.json');
const ytdl = require('ytdl-core');

// Initializing Discord.js client
const client = new Discord.Client();

// Initializing Giphy API 
var GphApiClient = require('giphy-js-sdk-core')
giphy = GphApiClient(giphyToken)

var url = require('url').URL;
var servers = {};

const queue = new Map();


// starts loop of random quote sourcer

var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop;


// randomizes quote sources from list 
function randomQuote(){
    return quotes[Math.floor(Math.random() * quotes.length)];
};
il.add(randomQuote, []);

il.run();

console.log(randomQuote());


    client.once('ready', () => {
    console.log('Ready')
    client.user.setActivity('The Joy of Painting');

    
})


client.on('message', async message => {

  let args = message.content.substring(prefix.length).split(" ");

  switch (args[0]) {
    case 'play':

    function play(connection, message){
      var server = servers[message.guild.id];

      server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

      server.queue.shift();

      server.dispatcher.on("end", function(){
        if(server.queue[0]){
          play(connection, message);
         
        }
        else{
          connection.disconnect();

        }
      });
    }

    if(!args[1]){
      message.reply("Did not provide a url. Try again.");
      return;
    }
    

    if(!message.member.voiceChannel){
      message.reply("Join a voice channel.");
      return;
    }

    if(!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    }

    var server = servers[message.guild.id];

    server.queue.push(args[1]);
    
    if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
      play(connection, message);
      // ytdl.validateURL(URL)

      message.reply("Playing Song")
    })//.catch(e => { console.log(e) });

    break;

    case 'skip':
      var server = servers[message.guild.id];
      if(server.dispatcher) server.dispatcher.end();
      message.reply("Skipping Song")

      break;

      case 'stop':
          var server = servers[message.guild.id];
          if(message.guild.voiceConnection){
            for(var i = server.queue.length -1; i >=0; i--){
              server.queue.splice(i, 1);
            }
            server.dispatcher.end();
            message.channel.send("Queue ended, leaving voice channel.")
            console.log('queue stopped')
          }

          if(message.guild.connection) message.guild.voiceConnection.disconnect();

      break;

  }


    if (message.author.bot) return;

    if (!message.guild) return;

    if(message.content.indexOf(prefix) !== 0) return;

    // This whole block is for joining voice channel -- Need to install FFMPEG & node-opus

     /* if (message.content.startsWith(`${prefix}join`)) {
        // Only try to join the sender's voice channel if they are in one
          if (message.member.voiceChannel) {
          message.member.voiceChannel.join()
            .then(connection => { // Connection to  instance of vc
              message.reply('Successfully connected to the channel');
              // Plays from a .mp3 url
             connection.playArbitraryInput('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3');
            })
            .catch(console.log);
        } else {
          message.reply('join a voice channel first!');
        }
      }  */
      

      if (message.content.startsWith(`${prefix}test`)) {
          message.channel.send(" test message recieved");
      }



      if(message.content.startsWith(`${prefix}ping`)) {
        // Calculates ping between sending a message and editing it, giving round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
      }

    if (message.content.startsWith(`${prefix}quote`)) {
        message.channel.send(randomQuote());
       // Use for testing - message.channel.send("-- Bob Ross");
      }


      if (message.content.startsWith(`${prefix}avatar`)) {
        let member = message.mentions.members.first();
        message.channel.send("Here you go, this is " + member.displayName + "'s " + "avatar");

        const user = message.mentions.users.first() || message.author;
        const avatarEmbed = new Discord.RichEmbed()
            .setColor(0x333333)
            .setAuthor(user.username)
            .setImage(user.avatarURL);
        message.channel.send(avatarEmbed);
    }


    // Another method, though can only do authored user

      /* if (message.content.startsWith(`${prefix}meavatar`)){
        // Send the user's avatar URL
        message.reply(message.author.avatarURL);
      } */


    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if(message.content.startsWith(`${prefix}bobross`)){
      giphy.search('gifs', {"q": "bobross"})
      .then((response) =>{
          var totalResponses = response.data.length;
          var responseIndex = Math.floor((Math.random() * 50) + 1) % totalResponses;
          var responseFinal = response.data[responseIndex];

          message.channel.send("Here you go, Bob Ross gifs:", {
              files: [responseFinal.images.fixed_height.url]
          })
      })
      
      .catch(() => {
          message.channel.send('Error');

      })
  }



    if(message.content.startsWith(`${prefix}ross`)){
        giphy.search('gifs', {"q": "bobross" || "bob ross"})
        .then((response) =>{
            var totalResponses = response.data.length;
            var responseIndex = Math.floor((Math.random() * 50) + 1) % totalResponses;
            var responseFinal = response.data[responseIndex];

            message.channel.send("Here you go, Praise the Ross", {
                files: [responseFinal.images.fixed_height.url]
            })
        })
        
        .catch(() => {
            message.channel.send('Error');

        })
    }

            if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {

            //  console.log(message.content);

            if(message.content.startsWith(`${prefix}kick`)){

            // message.channel.send("test message recieved")

            let member = message.mentions.members.first();
            member.kick().then((member) => {
            message.channel.send("User " + member.displayName + " kicked from server")

         })
     }
    }   
})

  

client.login(token);
