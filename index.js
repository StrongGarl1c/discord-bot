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

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

client.on('message', (message) => {
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
  } else if (message.content.toLowerCase() == '/jarko play') {
    voiceChannel
      .join()
      .then((connection) => {
        connection.play(
          ytdl(gachiMusic[Math.floor(Math.random() * gachiMusic.length)], {
            filter: 'audioonly',
          }),
        );
      })
      
      .catch((err) => {
        console.error(err);
      });
  }
  // else if (message.content.toLowerCase() == '/jarko play all') {
  //   voiceChannel
  //     .join()
  //     .then((connection) => {
  //       let index = 0;
  //       const randomGachi = gachiMusic.sort(function (a, b) {
  //         return 0.5 - Math.random();
  //       });

  //       const stream = ytdl(randomGachi[index], { filter: 'audioonly' });
  //       const dispatcher = connection.play(stream);

  //       dispatcher.on('finish', () => {
  //         index++;
  //         randomGachi.length < index ? ranndomGachiMusic() : null;
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }
  else if (message.content.toLowerCase() == '/jarko stop') {
    voiceChannel.join().then((connection) => connection.disconnect());
  } else if (message.content.toLowerCase() == '/jarko slonik') {
    voiceChannel
      .join()
      .then((connection) => {
        connection.play(
          ytdl('https://youtu.be/BEGWwKiIbvY', {
            filter: 'audioonly',
          }),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
