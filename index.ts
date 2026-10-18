import 'dotenv/config';
import {
  Client,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import {
  type AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  type VoiceConnection,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { hello } from './hello.js';
import { mat1 } from './mat1.js';
import { mat2 } from './mat2.js';
import { help } from './help.js';
import { Queue } from './queue.js';

type MusicSession = {
  connection: VoiceConnection;
  player: AudioPlayer;
  queue: Queue;
};

const token = process.env.TOKEN;
if (!token) {
  throw new Error('Missing TOKEN environment variable.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const musicSessions = new Map<string, MusicSession>();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.inGuild()) return;

  const content = message.content.toLowerCase();
  if (content === '/jarko help') {
    await message.reply(help);
    return;
  }

  if (
    hello.some((item) => `${item} bot` === content) ||
    hello.some((item) => `${item} бот` === content)
  ) {
    if (
      message.author.username === 'Шкура' ||
      message.author.username === 'StrongGarl1c'
    ) {
      await message.reply('Доброго дня господар!');
    } else {
      await message.reply(`привіт ${mat1()} ${mat2()}`);
    }
    return;
  }

  if (content === '/jarko stop') {
    const session = musicSessions.get(message.guildId);
    if (session) {
      session.queue.state = [];
      session.player.stop(true);
      getVoiceConnection(message.guildId)?.destroy();
      musicSessions.delete(message.guildId);
    }
    return;
  }

  if (
    !message.content.includes('/jarko https://www.youtube.com') &&
    !message.content.includes('/jarko https://youtu.be')
  ) {
    return;
  }

  const videoUrl = message.content.replace('/jarko ', '');
  const voiceChannelId =
    message.guildId === '241647348021723136'
      ? '241647348021723137'
      : '863788448539738135';

  try {
    const voiceChannel = await client.channels.fetch(voiceChannelId);
    if (!voiceChannel?.isVoiceBased()) {
      throw new Error(`Configured channel ${voiceChannelId} is not a voice channel.`);
    }

    let session = musicSessions.get(message.guildId);
    if (!session) {
      const connection =
        getVoiceConnection(message.guildId) ??
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guildId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
      const player = createAudioPlayer();
      const queue = new Queue();

      connection.subscribe(player);
      session = { connection, player, queue };
      musicSessions.set(message.guildId, session);

      player.on(AudioPlayerStatus.Idle, () => {
        if (queue.state.length > 0) queue.removeElement();
        const nextSong = queue.nextSong();
        if (nextSong) {
          player.play(createAudioResource(ytdl(nextSong, { filter: 'audioonly' })));
        }
      });
      player.on('error', (error) => {
        console.error(`Audio player error in guild ${message.guildId}:`, error);
      });
      connection.on('error', (error) => {
        console.error(`Voice connection error in guild ${message.guildId}:`, error);
      });
    }

    session.queue.addElement(videoUrl);
    if (session.player.state.status === AudioPlayerStatus.Idle) {
      const nextSong = session.queue.nextSong();
      if (nextSong) {
        session.player.play(createAudioResource(ytdl(nextSong, { filter: 'audioonly' })));
      }
    }
  } catch (error) {
    console.error('Failed to play requested YouTube link:', error);
    await message.reply('Unable to play that video. Check the configured voice channel and bot permissions.');
  }
});

await client.login(token);
