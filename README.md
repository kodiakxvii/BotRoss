# BotRoss
Discord bot written in the node.js module Discord.js centered around the theme of Bob Ross, the painter, art instructor, and television host of The Joy of Painting.


## Functions 
* Uses the period as its command prefix eg. '.join'

* Bot can pull gifs from giphy using the giphy pull API with the command '.ross' (Only pulls gifs the the tags 'bob ross' or 'bobross' on giphy due to giphy API limitations. 

* Can join voice channels and play linked music from YouTube with a queue system using YTDLcore. Commands include '.play', '.join', '.skip' and '.stop'

* Random quote sourcer from a txt file of available themed Bob Ross quotes using the command '.quote'. Can be expanded with more quotes.

* Ping function to calculate the ping between the bot sending a message and editing it, giving round-trip latency. The second ping is an average latency between the bot and the websocket server (one-way, not round-trip).

* User profile photo sourcer that grabs, embeds and mentions the profile photo of the targeted user in chat. Usage: '.avatar @USER'
* Administrative functions for kicking and banning discord members with the commands '.kick' or '.ban'. Users must have the 'KICK_MEMBERS' or 'BAN_MEMBERS' permissions in Discord.



