require('dotenv').config({ path: './.env' });
const Discord = require('discord.js');
const google = require('googleapis');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const token = process.env.TOKEN;
const hello = require('./hello');
const mat1 = require('./mat1');
const mat2 = require('./mat2');
const gachiMusic = require('./gachiMusic');
const help = require('./help');
const Queue = require('./queue');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

client.on('message', async (message) => {
  const voiceChannel =
    message.guild.id == 241647348021723136
      ? client.channels.cache.get('241647348021723137')
      : client.channels.cache.get('863788448539738135');
  if (message.author.bot) return;
  else if (message.content.toLowerCase() == '/jarko help') {
    message.reply(help);
  } else if (
    hello.some((item) => `${item} bot` == message.content.toLowerCase()) ||
    hello.some((item) => `${item} бот` == message.content.toLowerCase())
  ) {
    message.author.username == 'Шкура' || 'StrongGarl1c'
      ? message.reply('Здраствуй создатель!')
      : message.reply(`привет ${mat1()} ${mat2()}`);
  } else if (
    message.content.includes('/jarko https://www.youtube.com') ||
    message.content.includes('/jarko https://youtu.be')
  ) {
    const newSong = message.content.replace('/jarko ', '');
    const connection = await voiceChannel.join();
    try {
      if (!Queue.state.length) {
        Queue.addElement(newSong);
        const currentSong = await connection.play(
          ytdl(newSong, {
            filter: 'audioonly',
          }),
        );
        currentSong.on('finish', () => {
          console.log('finished');
          Queue.removeElement();
          connection.play(
            ytdl(Queue.nextSong(), {
              filter: 'audioonly',
            }),
          );
        });
      } else {
        Queue.addElement(newSong);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (message.content.toLowerCase() == '/jarko stop') {
    const connection = await voiceChannel.join();
    connection.disconnect();
    Queue.state = [];
  } else if (message.content.toLowerCase() == '/jarko slonik') {
    try {
      const connection = await voiceChannel.join();
      Queue.addElement('./Зеленый слоник.1999.VHSRip.XviD.AC3.avi');
      connection.play('./Зеленый слоник.1999.VHSRip.XviD.AC3.avi');
    } catch (error) {
      console.log(error);
    }
  }
});
